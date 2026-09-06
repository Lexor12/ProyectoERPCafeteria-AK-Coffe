import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductoInventarioComponent } from './editar-producto-inventario.component/editar-producto-inventario.component';

describe('EditarProductoInventarioComponent', () => {
  let component: EditarProductoInventarioComponent;
  let fixture: ComponentFixture<EditarProductoInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductoInventarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarProductoInventarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
