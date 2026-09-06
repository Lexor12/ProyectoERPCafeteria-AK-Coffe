import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-inventario',
  imports: [],
  templateUrl: './producto-inventario.component.html',
  styleUrl: './producto-inventario.component.css',
})
export class ProductoInventarioComponent {
  idProducto = input.required<string>();
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precio = input.required<number>();
  stock = input.required<number>();
  imagenUrl = input<string>('');

  desactivar = output<string>();
  editar = output<string>();

  clickDesactivar(): void {
    this.desactivar.emit(this.idProducto());
  }

  clickEditar(): void {
    this.editar.emit(this.idProducto());
  }
}
