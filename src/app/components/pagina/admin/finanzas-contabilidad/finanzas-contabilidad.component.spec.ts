import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanzasContabilidadComponent } from './finanzas-contabilidad.component/finanzas-contabilidad.component';

describe('FinanzasContabilidadComponent', () => {
  let component: FinanzasContabilidadComponent;
  let fixture: ComponentFixture<FinanzasContabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanzasContabilidadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanzasContabilidadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
