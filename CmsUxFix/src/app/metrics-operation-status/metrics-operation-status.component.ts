import { Component, OnInit, SimpleChanges, Input, OnChanges, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AnalyticsService } from '../analytics/analytics.service';
import { applicationConstants } from '../constants';

@Component({
  selector: 'app-metrics-operation-status',
  templateUrl: './metrics-operation-status.component.html',
})
export class MetricsOperationStatusComponent extends BaseComponent implements OnChanges {

  @Input() query: any;
  operationMetrics: any;

  constructor(public injector: Injector, private analyticsService: AnalyticsService) {
    super(injector, { title: undefined } as any);
    this.setStaticData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query']) {

    }
  }

  getCacheMetrics() {
    this.analyticsService.getSuccessFailureMetrics(this.query).then(responseId => {
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getCacheMetrics });
    });
  }

  GetSuccessFailureMetrics(notification) {
    this.operationMetrics = notification.data.content.data;
  }


  setStaticData() {
    this.operationMetrics = {
      labels: ['Success', 'Failure'],
      datasets: [
        {
          data: [300, 50],
          backgroundColor: [
            '#1c9ad5', '#000000',
          ],
          hoverBackgroundColor: [
            '#1c9ad5', '#000000',
          ]
        }]
    };
  }


}
