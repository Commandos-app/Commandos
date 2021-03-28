import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLessLayoutComponent } from './nav-less.component';

describe('NavLessComponent', () => {
    let component: NavLessLayoutComponent;
    let fixture: ComponentFixture<NavLessLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavLessLayoutComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavLessLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
