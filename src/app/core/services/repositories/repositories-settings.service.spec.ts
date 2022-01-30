/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { RepositoriesSettingsService } from './repositories.service';

describe('Service: Repositories', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RepositoriesSettingsService],
        });
    });

    it('should ...', inject([RepositoriesSettingsService], (service: RepositoriesSettingsService) => {
        expect(service).toBeTruthy();
    }));
});
