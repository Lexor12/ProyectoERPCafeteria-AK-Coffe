import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductoProveedorComponent } from './agregar-producto-proveedor.component/agregar-producto-proveedor.component';

describe('AgregarProductoProveedorComponent', () => {
  let component: AgregarProductoProveedorComponent;
  let fixture: ComponentFixture<AgregarProductoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProductoProveedorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProductoProveedorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
