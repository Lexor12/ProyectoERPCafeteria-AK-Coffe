import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductoProveedorComponent } from './editar-producto-proveedor.component/editar-producto-proveedor.component';

describe('EditarProductoProveedorComponent', () => {
  let component: EditarProductoProveedorComponent;
  let fixture: ComponentFixture<EditarProductoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductoProveedorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProductoProveedorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
