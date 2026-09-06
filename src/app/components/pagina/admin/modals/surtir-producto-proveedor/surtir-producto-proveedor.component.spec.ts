import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurtirProductoProveedorComponent } from './surtir-producto-proveedor.component/surtir-producto-proveedor.component';

describe('SurtirProductoProveedorComponent', () => {
  let component: SurtirProductoProveedorComponent;
  let fixture: ComponentFixture<SurtirProductoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurtirProductoProveedorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurtirProductoProveedorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
