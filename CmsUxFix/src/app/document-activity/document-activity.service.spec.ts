import { TestBed, inject } from '@angular/core/testing';

import { DocumentActivityService } from './document-activity.service';

describe('DocumentActivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentActivityService]
    });
  });

  it('should be created', inject([DocumentActivityService], (service: DocumentActivityService) => {
    expect(service).toBeTruthy();
  }));
});
