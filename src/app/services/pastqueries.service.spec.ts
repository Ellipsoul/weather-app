import { TestBed } from '@angular/core/testing';

import { PastqueriesService } from './pastqueries.service';

describe('PastqueriesService', () => {
  let service: PastqueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PastqueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
