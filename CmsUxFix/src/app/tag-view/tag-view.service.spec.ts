import { TestBed, inject } from '@angular/core/testing';

import { TagViewService } from './tag-view.service';

describe('TagViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagViewService]
    });
  });

  it('should be created', inject([TagViewService], (service: TagViewService) => {
    expect(service).toBeTruthy();
  }));
});
