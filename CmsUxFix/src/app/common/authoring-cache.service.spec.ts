import { TestBed, inject } from '@angular/core/testing';

import { AuthoringCacheService } from './authoring-cache.service';

describe('AuthoringCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthoringCacheService]
    });
  });

  it('should be created', inject([AuthoringCacheService], (service: AuthoringCacheService) => {
    expect(service).toBeTruthy();
  }));
});
