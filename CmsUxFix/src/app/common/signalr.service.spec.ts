import { TestBed, inject } from '@angular/core/testing';

import { SignalrService } from './signalr.service';

describe('SignalrServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalrService]
    });
  });

  it('should be created', inject([SignalrService], (service: SignalrService) => {
    expect(service).toBeTruthy();
  }));
});
