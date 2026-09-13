import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPedidoAdminComponent } from './detalles-pedido-admin.component';

describe('DetallesPedidoAdminComponent', () => {
  let component: DetallesPedidoAdminComponent;
  let fixture: ComponentFixture<DetallesPedidoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesPedidoAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesPedidoAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
