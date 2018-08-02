import { TestBed, inject } from '@angular/core/testing';

import { OperationStatusService } from './operation-status.service';

describe('OperationStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationStatusService]
    });
  });

  it('should be created', inject([OperationStatusService], (service: OperationStatusService) => {
    expect(service).toBeTruthy();
  }));
});
