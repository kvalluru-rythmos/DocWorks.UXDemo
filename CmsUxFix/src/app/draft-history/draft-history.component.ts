import { Component, Input, SimpleChanges, OnChanges, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { DraftService } from '../new-draft/draft.service';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material';
import { CreateDraftFromSnapshotComponent } from '../create-draft-from-snapshot/create-draft-from-snapshot.component';
import { ViewDraftComponent } from '../view-draft/view-draft.component';
import * as _ from 'underscore';
import { DiffOperation, applicationConstants } from '../constants';

@Component({
    selector: 'app-draft-history',
    templateUrl: './draft-history.component.html',
    providers: [DraftService]
})
export class DraftHistoryComponent extends BaseComponent implements OnChanges {

    @Input() selectedNodeId: any;
    @Input() selectedDraftId: any;
    @Input() nodeDrafts: any;
    @Input() align: any;
    pageNumber = 1;
    pageSize = environment.pageSize;
    draftHistoryList = [];
    isDraftHistoryInProgress: boolean;
    isNewSnapShotCreated: boolean;

    constructor(public injector: Injector, private draftService: DraftService, public dialog: MatDialog) {
        super(injector, { title: undefined } as any);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedDraftId']) {
            this.isNewSnapShotCreated = false;
            this.unsubscribe();
            this.topic = { subscriptionTopic: 'Draft/' + this.selectedDraftId, value: this.align + 'Draft/' + this.selectedDraftId, eventName: 'validateDraftContentEvent' };
            this.subscribeTopic();
            this.pageNumber = 1;
            this.draftHistoryList = [];
            this.getDraftHistoryList();
        }
    }

    getDraftHistoryList() {
        this.isNewSnapShotCreated = false;
        if (!this.isDraftHistoryInProgress) {
            this.isDraftHistoryInProgress = true;
            this.draftService.getDraftHistory(this.selectedDraftId, this.pageSize, this.pageNumber).then(responseId => {
                this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getDraftHistory });
            });
        }
    }

    onScrollDown() {
        this.getDraftHistoryList();
    }

    onScrollUp() {
        this.isNewSnapShotCreated = false;
        this.pageNumber = 1;
        this.draftHistoryList = [];
        this.getDraftHistoryList();
    }

    getDraftHistoryEvent(notification) {
        this.isDraftHistoryInProgress = false;
        this.isNewSnapShotCreated = false;
        if (notification.data.content.draftHistory && notification.data.content.draftHistory.length > 0) {
            this.pageNumber++;
            if (!this.draftHistoryList && this.draftHistoryList.length > 0) {
                _.each(notification.data.content.draftHistory, function (draftSnapshot) {
                    this.draftHistoryList.push(draftSnapshot);
                }.bind(this));
            } else {
                this.draftHistoryList = notification.data.content.draftHistory;
            }
        }
    }

    validateDraftContentEvent(notification) {
        if (notification.data && notification.data.content) {
            return;
        } else {
            this.isNewSnapShotCreated = true;
        }
    }

    returnDiffHtml(content) {
        let htmlContent = '';
        if (content) {
            const diffContentArray = JSON.parse(content);
            _.each(diffContentArray, function (diff) {
                let tempContent = '';
                diff.text = diff.text ? diff.text.split(' ').join('&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />') : '';
                switch (diff.operation) {
                    case DiffOperation.DELETE:
                        tempContent += '<span class="diff-delete">' + diff.text + '</span>';
                        break;
                    case DiffOperation.EQUAL:
                        tempContent += '<span class="diff-equal">' + (diff.text.length > applicationConstants.diffMaxCharLength ? diff.text.substring(0, applicationConstants.diffMaxCharLength) + '<br>... <br>' : diff.text) + '</span>';
                        break;
                    case DiffOperation.INSERT:
                        tempContent += '<span class="diff-insert">' + diff.text + '</span>';
                        break;
                }
                htmlContent += tempContent;
            });
        }
        return htmlContent;
    }

    openCreateDraftDialog(value) {
        this.dialog.open(CreateDraftFromSnapshotComponent, { data: { nodeId: this.selectedNodeId, draftId: this.selectedDraftId, snapshotId: value.snapshotId, nodeDrafts: this.nodeDrafts }, width: '360px' });
    }

    openViewDraftDialog(value) {
        this.dialog.open(ViewDraftComponent, { data: { snapshotId: value.snapshotId }, width: '560px', minHeight: '200px' });
    }

}
