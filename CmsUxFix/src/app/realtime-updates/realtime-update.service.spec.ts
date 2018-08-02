import { TestBed, inject } from '@angular/core/testing';

import { RealtimeUpdateService } from './realtime-update.service';

describe('RealtimeUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealtimeUpdateService]
    });
  });

  it('should be created', inject([RealtimeUpdateService], (service: RealtimeUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
