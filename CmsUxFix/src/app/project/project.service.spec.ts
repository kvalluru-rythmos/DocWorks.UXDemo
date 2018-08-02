import { TestBed, inject } from '@angular/core/testing';

import { ProjectService } from './project.service';
import {FakeProjectService } from '../app.mock-services';

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ProjectService, useValue: FakeProjectService }]
    });
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

});


