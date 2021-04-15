import { TestBed } from '@angular/core/testing';

import { WindowserviceService } from './windowservice.service';

describe('WindowserviceService', () => {
  let service: WindowserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
