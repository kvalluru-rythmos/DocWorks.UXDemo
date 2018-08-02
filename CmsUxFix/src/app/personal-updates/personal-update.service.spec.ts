import { TestBed, inject } from '@angular/core/testing';

import { PersonalUpdateService } from './personal-update.service';

describe('PersonalUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalUpdateService]
    });
  });

  it('should be created', inject([PersonalUpdateService], (service: PersonalUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
