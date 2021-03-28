import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositorySettingComponent } from './repository-setting.component';

describe('RepositorySettingComponent', () => {
  let component: RepositorySettingComponent;
  let fixture: ComponentFixture<RepositorySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepositorySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositorySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
