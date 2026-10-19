import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoRechazadoComponent } from './pago-rechazado.component/pago-rechazado.component';

describe('PagoRechazadoComponent', () => {
  let component: PagoRechazadoComponent;
  let fixture: ComponentFixture<PagoRechazadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoRechazadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoRechazadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
