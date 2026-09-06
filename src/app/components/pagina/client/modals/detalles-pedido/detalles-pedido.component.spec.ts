import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPedidoComponent } from './detalles-pedido/detalles-pedido.component/detalles-pedido.component';

describe('DetallesPedidoComponent', () => {
  let component: DetallesPedidoComponent;
  let fixture: ComponentFixture<DetallesPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesPedidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesPedidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
