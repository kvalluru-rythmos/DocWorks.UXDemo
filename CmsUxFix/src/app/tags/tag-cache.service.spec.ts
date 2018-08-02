import { TestBed, inject } from '@angular/core/testing';

import { TagCacheService } from './tag-cache.service';

describe('TagCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagCacheService]
    });
  });

  it('should be created', inject([TagCacheService], (service: TagCacheService) => {
    expect(service).toBeTruthy();
  }));
});
