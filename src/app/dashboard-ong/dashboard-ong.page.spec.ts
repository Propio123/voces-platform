import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOngPage } from './dashboard-ong.page';

describe('DashboardOngPage', () => {
  let component: DashboardOngPage;
  let fixture: ComponentFixture<DashboardOngPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOngPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
