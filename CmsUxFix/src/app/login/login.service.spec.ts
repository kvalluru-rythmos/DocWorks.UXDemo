import { TestBed, inject } from '@angular/core/testing';
import { LoginService } from './login.service';
import { Observable } from 'rxjs/Observable';
import { FakeLoginService } from '../app.mock-services';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoginService, useValue: FakeLoginService }
      ]
    });
  });

  it('should be created', inject([LoginService], (service: FakeLoginService) => {
    expect(service).toBeTruthy();
  }));

  it('do login', inject([LoginService], () => {
    const service = new FakeLoginService();
    const username = '';
    const password = '';
    expect(service.doLogin(username, password)).toEqual('success');
  }));
});


