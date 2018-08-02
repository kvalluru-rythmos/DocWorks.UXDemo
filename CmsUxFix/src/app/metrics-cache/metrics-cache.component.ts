import { Component, OnInit, SimpleChanges, OnChanges, Input, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AnalyticsService } from '../analytics/analytics.service';
import { applicationConstants } from '../constants';

@Component({
  selector: 'app-metrics-cache',
  templateUrl: './metrics-cache.component.html',
})
export class MetricsCacheComponent extends BaseComponent implements OnChanges {

  cacheMetrics: any;
  @Input() query: any;
  constructor(public injector: Injector, private analyticsService: AnalyticsService) {
    super(injector, { title: undefined } as any);
    this.setStaticData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query']) {

    }
  }

  getCacheMetrics() {
    this.analyticsService.getCacheMetrics(this.query).then(responseId => {
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getCacheMetrics });
    });
  }

  GetCacheMetrics(notification) {
    this.cacheMetrics = notification.data.content.data;
  }


  setStaticData() {
    this.cacheMetrics = {
      labels: [
        'Frontend Only',
        'Backend Only',
        'Backend and Stale Frontend Used',
        'Frontend + Backend Used',
        'No Cache',
        'Stale Frontend Only'
      ],
      datasets: [
        {
          data: [300, 50, 100, 150, 10, 200],
          backgroundColor: [
            '#4bc0c0',
            '#36a2eb',
            '#9966ff',
            '#ff6384',
            '#ff9f40',
            '#ffcd56',
          ],
          hoverBackgroundColor: [
            '#4bc0c0',
            '#36a2eb',
            '#9966ff',
            '#ff6384',
            '#ff9f40',
            '#ffcd56',
          ]
        }]
    };
  }
}
