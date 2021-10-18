import { ComponentFixture, TestBed } from '@angular/core/testing';

import { commandosComponent } from './commandos.component';

describe('commandosComponent', () => {
  let component: commandosComponent;
  let fixture: ComponentFixture<commandosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ commandosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(commandosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
