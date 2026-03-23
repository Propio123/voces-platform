import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MejorasLaboralesPage } from './mejoras-laborales.page';

describe('MejorasLaboralesPage', () => {
  let component: MejorasLaboralesPage;
  let fixture: ComponentFixture<MejorasLaboralesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MejorasLaboralesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
