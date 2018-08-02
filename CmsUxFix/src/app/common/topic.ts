import {HubConnection} from '@aspnet/signalr';
import {Observable} from 'rxjs/Observable';

export class Topic {
  private hubConnection: HubConnection;

  constructor(private aHubConnection: HubConnection) {
    this.hubConnection = aHubConnection;
  }

  subscribe(name): Observable<any> {
    return Observable.create(observer => {
      this.hubConnection.invoke('JoinRoom', name);
      this.hubConnection.on('JoinedRoom', (data) => {
        if (data === name) {
          observer.next(data + ' Joined');
          observer.complete();
        }
      });
    });
  }

  unsubscribe(name): Observable<any> {
    return Observable.create(observer => {
      this.hubConnection.invoke('LeaveRoom', name);
      this.hubConnection.on('ExitedRoom', (data) => {
        if (data === name) {
          observer.next(data + ' Exited');
          observer.complete();
        }
      });
    });
  }
}
