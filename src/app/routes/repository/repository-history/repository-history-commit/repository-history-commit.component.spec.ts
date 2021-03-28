import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryHistoryCommitComponent } from './repository-history-commit.component';

describe('RepositoryHistoryCommitComponent', () => {
  let component: RepositoryHistoryCommitComponent;
  let fixture: ComponentFixture<RepositoryHistoryCommitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositoryHistoryCommitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryHistoryCommitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
