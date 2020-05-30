import { TestBed } from '@angular/core/testing';

import { BreederService } from './breeder.service';

describe('BreederService', () => {
  let service: BreederService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreederService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
