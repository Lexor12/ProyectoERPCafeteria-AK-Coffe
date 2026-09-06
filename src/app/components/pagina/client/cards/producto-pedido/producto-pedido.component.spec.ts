import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoPedidoComponent } from './producto-pedido.component';

describe('ProductoPedidoComponent', () => {
  let component: ProductoPedidoComponent;
  let fixture: ComponentFixture<ProductoPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoPedidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoPedidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
