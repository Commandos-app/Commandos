import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryBranchComponent } from './repository-branch.component';

describe('RepositoryBranchComponent', () => {
    let component: RepositoryBranchComponent;
    let fixture: ComponentFixture<RepositoryBranchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepositoryBranchComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepositoryBranchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
