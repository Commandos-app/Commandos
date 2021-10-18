import { ComponentFixture, TestBed } from '@angular/core/testing';

import { commandosModalComponent } from './commandos-modal.component';

describe('commandosModalComponent', () => {
  let component: commandosModalComponent;
  let fixture: ComponentFixture<commandosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ commandosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(commandosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
