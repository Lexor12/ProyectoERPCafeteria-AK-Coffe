import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-inventario',
  imports: [],
  templateUrl: './producto-inventario.component.html',
  styleUrl: './producto-inventario.component.css',
})
export class ProductoInventarioComponent {
  //Definimos todas las propiedades posibles de una tarjeta, las cuales son las siguientes: (Estas se eligierón en base a los Mockups y lo que tiene la BD)
  idProducto = input.required<string>();
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precio = input.required<number>();
  stock = input.required<number>();
  imagenUrl = input<string>('');
  //Esto son los outputs, o eventos que nosotros vamos a enviar al padre, la tarjeta no realiza procesos como tal, solo muestra
  desactivar = output<string>();
  editar = output<string>();

  clickDesactivar(): void {
    this.desactivar.emit(this.idProducto());
  }

  clickEditar(): void {
    this.editar.emit(this.idProducto());
  }
}
