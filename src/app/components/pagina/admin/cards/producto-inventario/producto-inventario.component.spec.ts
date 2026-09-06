import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoInventarioComponent } from './producto-inventario.component';

describe('ProductoInventarioComponent', () => {
  let component: ProductoInventarioComponent;
  let fixture: ComponentFixture<ProductoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoInventarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoInventarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
