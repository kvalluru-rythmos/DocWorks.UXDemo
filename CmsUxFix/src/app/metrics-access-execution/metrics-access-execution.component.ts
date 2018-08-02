import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AnalyticsService } from '../analytics/analytics.service';
import { applicationConstants } from '../constants';

@Component({
  selector: 'app-metrics-access-execution',
  templateUrl: './metrics-access-execution.component.html',
})
export class MetricsAccessExecutionComponent extends BaseComponent implements OnChanges {

  @Input() query: any;
  executionMetrics: any;
  graphType = 1;

  constructor(public injector: Injector, private analyticsService: AnalyticsService) {
    super(injector, { title: undefined } as any);
    this.setStaticData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query']) {

    }
  }

  changeGraphType(graphType) {
    this.graphType = graphType;
  }

  getAccessExecutionMetrics() {
      this.analyticsService.getAccessExecutionMetrics(this.query).then(responseId => {
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getAccessExecutionMetrics });
    });
  }

  GetAccessExecutionMetrics(notification) {
    this.executionMetrics = notification.data.content.data;
  }

  setStaticData() {
    this.executionMetrics = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Access Time',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#000000',
          backgroundColor: '#000000',
        },
        {
          label: 'Execution Time',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: '#1c9ad5',
          borderColor: '#1c9ad5'
        }
      ]
    };

  }
}
