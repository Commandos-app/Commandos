import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandosDiffComponent } from './commandos-diff.component';

describe('CommandosDiffComponent', () => {
    let component: CommandosDiffComponent;
    let fixture: ComponentFixture<CommandosDiffComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommandosDiffComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommandosDiffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
