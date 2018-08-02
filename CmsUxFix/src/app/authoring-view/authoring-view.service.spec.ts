import { TestBed, inject } from '@angular/core/testing';

import { AuthoringViewService } from './authoring-view.service';

describe('AuthoringViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthoringViewService]
    });
  });

  it('should be created', inject([AuthoringViewService], (service: AuthoringViewService) => {
    expect(service).toBeTruthy();
  }));
});
