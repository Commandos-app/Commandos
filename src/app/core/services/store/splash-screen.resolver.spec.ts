import { TestBed } from '@angular/core/testing';

import { SplashScreenResolver } from './splash-screen.resolver';

describe('SplashScreenResolver', () => {
    let resolver: SplashScreenResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(SplashScreenResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
