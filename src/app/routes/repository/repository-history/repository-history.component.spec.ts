import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryHistoryComponent } from './repository-history.component';

describe('RepositoryHistoryComponent', () => {
    let component: RepositoryHistoryComponent;
    let fixture: ComponentFixture<RepositoryHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RepositoryHistoryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepositoryHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
