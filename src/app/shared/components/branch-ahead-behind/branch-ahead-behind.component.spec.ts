import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAheadBehindComponent } from './branch-ahead-behind.component';

describe('BranchAheadBehindComponent', () => {
    let component: BranchAheadBehindComponent;
    let fixture: ComponentFixture<BranchAheadBehindComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BranchAheadBehindComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BranchAheadBehindComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
