import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoProveedorComponent } from './producto-proveedor.component';

describe('ProductoProveedorComponent', () => {
  let component: ProductoProveedorComponent;
  let fixture: ComponentFixture<ProductoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoProveedorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoProveedorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
