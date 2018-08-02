import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class TabService {

    constructor() { }
    tabs = [
        {
            'tabId': 0,
            'title': 'GDoc',
            'titleIcon': 'file-document',
            'displayContentInIframe': true,
            'contentType': 'GDoc',
            'CMSOperataion': ''
        },
        {
            'tabId': 1,
            'title': 'HTML',
            'titleIcon': 'code-not-equal-variant',
            'displayContentInIframe': false,
            'contentType': 'html',
            'CMSOperataion': 'GetDraftContentAsHtml'
        },
        {
            'tabId': 2,
            'title': '.md',
            'titleIcon': 'markdown',
            'displayContentInIframe': false,
            'contentType': 'md',
            'CMSOperataion': 'GetDraftContentAsMarkdown'
        },
        {
            'tabId': 3,
            'title': 'xml',
            'titleIcon': 'xml',
            'displayContentInIframe': false,
            'contentType': 'xml',
            'CMSOperataion': 'GetDraftContentAsXml'
        },
        {
            'tabId': 4,
            'title': 'preview',
            'titleIcon': 'eye',
            'displayContentInIframe': false,
            'contentType': 'html',
            'CMSOperataion': 'GetDraftContentAsHtml'
        },
        {
            'tabId': 5,
            'title': 'history',
            'titleIcon': 'history',
            'displayContentInIframe': false,
            'contentType': 'history',
            'CMSOperataion': ''
        }
    ];

    defaultTabs = [0, 1, 2, 4, 5];
    scriptRefTabs = [0, 1, 3, 4, 5];

    getScriptRefTabs() {
        return _.filter(this.tabs, function (tab) {
            return _.indexOf(this.scriptRefTabs, tab.tabId) >= 0;
        }.bind(this));
    }

    getDefaultTabs() {
        return _.filter(this.tabs, function (tab) {
            return _.indexOf(this.defaultTabs, tab.tabId) >= 0;
        }.bind(this));
    }
}
