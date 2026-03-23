import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluatorPage } from './evaluator.page';

describe('EvaluatorPage', () => {
  let component: EvaluatorPage;
  let fixture: ComponentFixture<EvaluatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
