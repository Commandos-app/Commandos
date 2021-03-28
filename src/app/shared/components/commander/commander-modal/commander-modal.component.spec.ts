import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderModalComponent } from './commander-modal.component';

describe('CommanderModalComponent', () => {
  let component: CommanderModalComponent;
  let fixture: ComponentFixture<CommanderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommanderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
