import { TestBed, inject } from '@angular/core/testing';

import { TypeformService } from './typeform.service';

describe('TypeformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeformService]
    });
  });

  it('should be created', inject([TypeformService], (service: TypeformService) => {
    expect(service).toBeTruthy();
  }));
});
