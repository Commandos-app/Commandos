import { TestBed } from '@angular/core/testing';

import { commandosModalService } from './commandos-modal.service';

describe('commandosModalService', () => {
    let service: commandosModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(commandosModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
