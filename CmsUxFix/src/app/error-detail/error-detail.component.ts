import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../common/http.service';
import { pageTitleList } from '../constants';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-error-detail',
  templateUrl: './error-detail.component.html',
})
export class ErrorDetailComponent extends BaseComponent implements OnInit {

  responseData: any;
  constructor(public injector: Injector, private route: ActivatedRoute, private httpService: HttpService) {
    super(injector, { title: pageTitleList.errorDetail } as any);
  }

  ngOnInit() {
    this.subscribeForRouteParams();
  }

  subscribeForRouteParams() {
    this.route.params.subscribe(params => {
      this.getResponse(params.responseId);
    });
  }

  getResponse(responseId) {
    this.httpService.getResponse(responseId).then(response => {
      this.responseData = response.json();
    });
  }
}
