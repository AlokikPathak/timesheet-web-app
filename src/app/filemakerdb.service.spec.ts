import { TestBed, inject } from '@angular/core/testing';

import { FilemakerdbService } from './filemakerdb.service';

describe('FilemakerdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilemakerdbService]
    });
  });

  it('should be created', inject([FilemakerdbService], (service: FilemakerdbService) => {
    expect(service).toBeTruthy();
  }));
});
