import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnavComponent } from './subnav.component';

describe('SubnavComponent', () => {
  let component: SubnavComponent;
  let fixture: ComponentFixture<SubnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
