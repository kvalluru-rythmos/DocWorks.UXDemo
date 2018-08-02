import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { pageTitleList, applicationConstants } from '../constants';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  providers: [AnalyticsService]
})
export class MetricsComponent extends BaseComponent implements OnInit {
  searchFormGroup: FormGroup;
  service = new FormControl('');
  operation = new FormControl('');
  event = new FormControl('');
  user = new FormControl('');
  fromDate = new FormControl('');
  toDate = new FormControl('');
  maxDate = new Date();
  query: any;

  piedata: any;
  filterView = 1;

  serviceList: any;
  operationList: any;
  eventList: any;
  userList: any;

  isServicesLoading: boolean;
  isOperationsLoading: boolean;
  isEventsLoading: boolean;
  isUserLoading: boolean;

  constructor(public injector: Injector, private formBuilder: FormBuilder, private analyticsService: AnalyticsService) {
    super(injector, { title: pageTitleList.analytics } as any);
    this.createSearchForm();
    this.setDummyData();
  }

  ngOnInit() {
    // this.getValues();
  }

  createSearchForm() {
    this.searchFormGroup = this.formBuilder.group({
      service: this.service,
      operation: this.operation,
      event: this.event,
      user: this.user,
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  getValues() {
    this.getServices();
    this.getOperations();
    this.getEvents();
    this.getUserList();
  }

  getServices() {
    this.isServicesLoading = true;
    this.analyticsService.getServices().then(response => {
      this.serviceList = response;
      this.isServicesLoading = false;
    });
  }

  getOperations() {
    this.isOperationsLoading = true;
    this.analyticsService.getOperations().then(response => {
      this.operationList = response;
      this.isOperationsLoading = false;
    });
  }

  getEvents() {
    this.isEventsLoading = true;
    this.analyticsService.getEvents().then(response => {
      this.eventList = response;
      this.isEventsLoading = false;
    });
  }

  getUserList() {
    this.isUserLoading = true;
    this.analyticsService.getUserList().then(responseId => {
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getUserList });
    });
  }

  getUserListEvent(notification: any) {
    this.isUserLoading = false;
    this.userList = notification.data.content.users;
  }

  updateSearchQuery(queryType) {
    this.filterView = queryType;
    const queryDate = this.constructFromDateToDate(queryType);
    this.query = {
      service: this.service.value,
      operation: this.operation.value,
      event: this.event.value,
      user: this.user.value,
      fromDate: queryDate.fromDate,
      toDate: queryDate.toDate,
    };
  }

  constructFromDateToDate(queryType) {
    let queryDate;
    const currentDate = new Date();
    switch (queryType) {
      case 1:
        queryDate = {
          fromDate: (this.returnfromDate(currentDate, 1 / 24)) / 1000,
          toDate: currentDate.getTime() / 1000,
        };
        break;
      case 2:
        queryDate = {
          fromDate: this.returnfromDate(currentDate, 1) / 1000,
          toDate: currentDate.getTime() / 1000,
        };
        break;
      case 3:
        queryDate = {
          fromDate: this.returnfromDate(currentDate, 7) / 1000,
          toDate: currentDate.getTime() / 1000,
        };
        break;
      case 4:
        queryDate = {
          fromDate: this.returnfromDate(currentDate, 30) / 1000,
          toDate: currentDate.getTime() / 1000,
        };
        break;
      default:
        if (this.fromDate.value && this.toDate.value) {
          queryDate = {
            fromDate: this.fromDate.value,
            toDate: this.toDate.value,
          };
        } else {
          queryDate = {
            fromDate: (this.returnfromDate(currentDate, 1 / 24)) / 1000,
            toDate: currentDate.getTime() / 1000,
          };
          this.filterView = 1;
        }
        break;
    }
    return queryDate;
  }

  returnfromDate(currentDate, days) {
    return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000).getTime();
  }

  resetSearch() {
    this.searchFormGroup.setValue({
      service: '',
      operation: '',
      event: '',
      user: '',
      fromDate: '',
      toDate: ''
    });
    this.query = {
      service: '',
      operation: '',
      event: '',
      user: '',
      fromDate: '',
      toDate: ''
    };
  }

  setDummyData() {
    this.serviceList = [
      { name: 'Core', id: '1' },
      { name: 'GDocFactory', id: '2' },
      { name: 'Orchestrator', id: '3' },
      { name: 'Publishing', id: '4' },
      { name: 'SourceSync', id: '5' },
      { name: 'Transformations', id: '6' }
    ];
    this.operationList = [
      { name: 'Create Project', id: '1' },
      { name: 'Get Project', id: '2' },
      { name: 'Update Project', id: '3' },
      { name: 'Delete Project', id: '4' }
    ];
    this.eventList = [
      { name: 'CoreUpsertProject', id: '1' },
      { name: 'CoreGetProjects', id: '2' },
      { name: 'CoreSetProjectComplete', id: '3' },
      { name: 'CoreGetProject', id: '4' }
    ];
    this.userList = [
      { name: 'Bhupendra Singh Bhandari', id: '1' },
      { name: 'Manish Bhakuni', id: '2' },
      { name: 'Mohit Tonde', id: '3' },
      { name: 'Mohit Ranjan Sahu', id: '4' },
      { name: 'Mohit Ranjan Sahu', id: '5' }
    ];

  }


}
