import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHintComponent } from './select-hint.component';

describe('SelectHintComponent', () => {
    let component: SelectHintComponent;
    let fixture: ComponentFixture<SelectHintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectHintComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectHintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
