import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffSideBySideComponent } from './diff-side-by-side.component';

describe('DiffSideBySideComponent', () => {
  let component: DiffSideBySideComponent;
  let fixture: ComponentFixture<DiffSideBySideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffSideBySideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffSideBySideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
