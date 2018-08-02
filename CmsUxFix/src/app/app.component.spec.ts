import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { routingComponents } from '../app/app.routing.module';

import { routingProviders } from './app.routing.module';
import { customPipes, customProviders } from './app.providers';
import { AppModules } from './app.module';
import { ActivatedRoute, Router } from '@angular/router';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy, ProjectServiceSpy } from './app.mock-services';
import { NgModule } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, HeaderComponent
      ],
      providers: [
        customProviders,
        customPipes,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [
        AppModules,
        RouterTestingModule
      ],
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

});


