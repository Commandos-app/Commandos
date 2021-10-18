import { TestBed } from '@angular/core/testing';

import { commandosService } from './commandos.service';

describe('commandosService', () => {
  let service: commandosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(commandosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
