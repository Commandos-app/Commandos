import { TestBed } from '@angular/core/testing';

import { CommanderService } from './commander.service';

describe('CommanderService', () => {
  let service: CommanderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommanderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
