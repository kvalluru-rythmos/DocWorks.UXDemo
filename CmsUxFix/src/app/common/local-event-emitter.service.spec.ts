import { TestBed, inject } from '@angular/core/testing';

import { LocalEventEmitterService } from './local-event-emitter.service';

describe('LocalEventEmitterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalEventEmitterService]
    });
  });

  it('should be created', inject([LocalEventEmitterService], (service: LocalEventEmitterService) => {
    expect(service).toBeTruthy();
  }));
});
