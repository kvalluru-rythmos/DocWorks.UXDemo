import { UserService } from './user.service';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Headers, Http, Response, HttpModule, BaseRequestOptions, RequestMethod } from '@angular/http';
import { TestBed, fakeAsync, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

const mockHttpProvider = {
  deps: [MockBackend, BaseRequestOptions],
  useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
    return new Http(backend, defaultOptions);
  }
};
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('HttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Http, useValue: mockHttpProvider },
        MockBackend,
        BaseRequestOptions,
        HttpService, UserService,
        { provide: Router, useValue: mockRouter }]
    });
  });

  it('should use an HTTP call Servers',
    inject(
      [HttpService, MockBackend],
      fakeAsync((service: HttpService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe('');
        });

      })));
});

