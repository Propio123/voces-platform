import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardUserPage } from './dashboard-user.page';

describe('DashboardUserPage', () => {
  let component: DashboardUserPage;
  let fixture: ComponentFixture<DashboardUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
