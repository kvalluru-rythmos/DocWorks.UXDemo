import { TestBed, inject } from '@angular/core/testing';

import { ImportDistributionService } from './import-distribution.service';

describe('ImportDistributionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportDistributionService]
    });
  });

  it('should be created', inject([ImportDistributionService], (service: ImportDistributionService) => {
    expect(service).toBeTruthy();
  }));
});
