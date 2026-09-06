import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-proveedor',
  imports: [],
  templateUrl: './producto-proveedor.component.html',
  styleUrl: './producto-proveedor.component.css',
})
export class ProductoProveedorComponent {
  idProducto = input.required<string>();
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precio = input.required<number>();
  imagenUrl = input<string>('');

  surtir = output<string>();

  clickSurtir(): void {
    this.surtir.emit(this.idProducto());
  }
}
