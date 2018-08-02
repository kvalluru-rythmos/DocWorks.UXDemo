import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AppModules } from '../app.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../common/notification.service';
import { LoginService } from './login.service';
import { UserService } from '../common/user.service';
import { mockRouter, mockActivatedRoute, mockNotificationService, LoginServiceSpy } from '../app.mock-services';
import { User } from '../common/user';
import { By } from '@angular/platform-browser';
import { inject } from '@angular/core/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: LoginServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [AppModules],
      providers: [{ provide: LoginService, useClass: LoginServiceSpy },
        UserService,
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: NotificationService, useValue: mockNotificationService },
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.get(LoginService);
  }));

  it('do login service called', () => {
    fixture.detectChanges();
    expect(loginServiceSpy.doLogin.calls.count()).toBe(0, 'do login called');
  });

  it('before click button should be disabled', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('button');
    fixture.detectChanges();
    expect(btn.disabled).toBe(true);
  });

  it('after filling data login form button should be enabled', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('button');
    component.user = new User();
    component.user.username = 'unit testing';
    component.user.token = 'test';
    component.user.password = 'test';
    component.captchaResponseToken = 'testtoken';
    expect(btn.disabled).toBe(false);
  });

  it('clicking on login button doLogin should be called', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('button');
    component.user = new User();
    component.user.username = 'unit testing';
    component.user.token = 'test';
    component.user.password = 'test';
    component.captchaResponseToken = 'testtoken';
    btn.click();
    fixture.detectChanges();
    expect(loginServiceSpy.doLogin.calls.count()).toBe(1, 'do login called');
  });

  it('should tell ROUTER to navigate when login is successfull',
    inject([Router], (router: Router) => { // ...
      const btn = fixture.debugElement.nativeElement.querySelector('button');
      const spy = spyOn(router, 'navigateByUrl');
      btn.click();
      const navArgs = loginServiceSpy.doLogin.calls.first().args[0];
      expect(navArgs).toBe('/dashboard', 'should nav to dashboard');
    }));

});



