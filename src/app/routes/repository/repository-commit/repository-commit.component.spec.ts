import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryCommitComponent } from './repository-commit.component';

describe('RepositoryCommitComponent', () => {
  let component: RepositoryCommitComponent;
  let fixture: ComponentFixture<RepositoryCommitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositoryCommitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryCommitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
