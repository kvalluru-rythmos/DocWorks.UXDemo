import {Injectable} from '@angular/core';
import {HubConnection} from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import {environment} from '../../environments/environment';
import {UserService} from './user.service';
import {LocalEventEmitterService} from './local-event-emitter.service';
import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';
import {utils} from '../common/utils';
import {Topic} from './topic';

@Injectable()
export class SignalrService {

  private hubConnection: HubConnection;
  public signalrId;
  private componentWiseStartupParameters: any = {}; // component name vs startup parameters
  private topicWiseSubscriptions: any = {}; // topic name vs number of current subscriptions
  private eventSubscriptions: any = {}; // event name vs array of component reference and callback method

  constructor(private userService: UserService, public localEventEmitterService: LocalEventEmitterService) {
  }

  initHubConnection(): Observable<any> {
    return Observable.create(observer => {
      if (this.hubConnection) {
        observer.next(this.signalrId);
      } else {
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(environment.API_BASE_URL + '/core?token=' + this.userService.getToken())
          .configureLogging(signalR.LogLevel.Information)
          .build();

        this.hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => {
            console.log(err);
            this.reconnect();
          });

        this.hubConnection.on('ConnectionReady', (data) => {
          this.signalrId = data;
          observer.next(this.signalrId);
        });

        this.hubConnection.onclose(() => {
            console.log('onclose');
            this.reconnect();
          }
        );
      }
    });
  }

  private reconnect() {
    console.log('Reconnect called');
    this.hubConnection = undefined;
    setTimeout(() => {
      this.initHubConnection().subscribe(signalrId => {
        console.log('Reconnected');
        let componentNames = _.keys(this.componentWiseStartupParameters);
        componentNames.forEach(function (componentName) {
          let startupParameters = this.componentWiseStartupParameters [componentName];
          this.subscribeEvents(startupParameters.reference, startupParameters.events);
          this.subscribeTopics(startupParameters.topics).subscribe((response) => {
            this.callComponentsStartupCallbacks(startupParameters.reference, startupParameters.startupRequestCallbacks);
          });
        }.bind(this));
      }, error => {
        console.log('Reconnection error');
      });
    }, 5000);
  }

  private subscribeTopics(topics): Observable<any> {
    let observables = [];
    _.each(topics, function (topic) {
      let currentSubscriptionCount = this.topicWiseSubscriptions [topic];
      if (!currentSubscriptionCount) { // this is a new topic that a component is trying to subscribe
        observables.push(new Topic(this.hubConnection).subscribe(topic).map((res) => res));
        currentSubscriptionCount = 0;
      }
      currentSubscriptionCount++;
      this.topicWiseSubscriptions [topic] = currentSubscriptionCount;
    }.bind(this));

    if (observables.length > 0) {
      return Observable.forkJoin(observables);
    } else {
      return Observable.create(observer => {
        observer.next('No topic to Subscribe');
        observer.complete();
      });
    }
  }

  private unsubscribeTopics(topics): Observable<any> {
    let observables = [];
    _.each(topics, function (topic) {
      let currentSubscriptionCount = this.topicWiseSubscriptions [topic];
      currentSubscriptionCount--;
      if (currentSubscriptionCount === 0) { // this is last component to unsubscribe to this topic
        observables.push(new Topic(this.hubConnection).unsubscribe(topic).map((res) => res));
        delete this.topicWiseSubscriptions [topic];
      } else {
        this.topicWiseSubscriptions [topic] = currentSubscriptionCount;
      }
    }.bind(this));

    if (observables.length > 0) {
      return Observable.forkJoin(observables);
    } else {
      return Observable.create(observer => {
        observer.next('No topic to unsubscribe');
        observer.complete();
      });
    }
  }

  private callComponentsStartupCallbacks(reference, startupCallbacks) {
    startupCallbacks.forEach(function (callback) {
      callback.call(reference);
    });
  }

  private unsubscribeEvents(events) {
    events.forEach(function (event) {
      let currentSubscriptions = this.eventSubscriptions [event.name];
      currentSubscriptions = currentSubscriptions.filter(function (subscription) {
        return subscription.callback !== event.callback;
      });

      this.eventSubscriptions [event.name] = currentSubscriptions;
      if (currentSubscriptions.length === 0) {
        this.hubConnection.off(event.name);
        delete this.eventSubscriptions [event.name];
      }
    }.bind(this));
  }

  private subscribeEvents(reference, events) {
    events.forEach(function (event) {
      let currentSubscriptions = this.eventSubscriptions [event.name];
      if (!currentSubscriptions) {
        currentSubscriptions = [];
        this.hubConnection.on(event.name, (data) => {
          currentSubscriptions.forEach(function (subscription) {
            subscription.callback.call(subscription.reference, new utils().toCamel(data));
          });
        });

        this.eventSubscriptions [event.name] = currentSubscriptions;
      }
      currentSubscriptions.push({reference: reference, callback: event.callback});
    }.bind(this));
  }

  startup(componentName, startupParameters) {
    this.componentWiseStartupParameters [componentName] = startupParameters;
    this.subscribeEvents(startupParameters.reference, startupParameters.events);
    this.subscribeTopics(startupParameters.topics).subscribe((response) => {
      this.callComponentsStartupCallbacks(startupParameters.reference, startupParameters.startupRequestCallbacks);
    });
  }

  shutdown(componentName) {
    let startupParameters = this.componentWiseStartupParameters [componentName];
    this.unsubscribeTopics(startupParameters.topics).subscribe((response) => {
      this.unsubscribeEvents(startupParameters.events);
      delete this.componentWiseStartupParameters [componentName];
    });
  }
}
