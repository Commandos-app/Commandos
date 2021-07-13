import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffLineByLineComponent } from './diff-line-by-line.component';

describe('DiffLineByLineComponent', () => {
  let component: DiffLineByLineComponent;
  let fixture: ComponentFixture<DiffLineByLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffLineByLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffLineByLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
