import { TestBed } from '@angular/core/testing';

import { CommanderModalService } from './commander-modal.service';

describe('CommanderModalService', () => {
    let service: CommanderModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommanderModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
