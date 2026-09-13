import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-proveedor',
  imports: [],
  templateUrl: './producto-proveedor.component.html',
  styleUrl: './producto-proveedor.component.css',
})
export class ProductoProveedorComponent {
  //Definimos todas las propiedades posibles de una tarjeta, las cuales son las siguientes: (Estas se eligierón en base a los Mockups y lo que tiene la BD)
  idProducto = input.required<string>();
  idProveedor = input.required<string>(); // <- nuevo input
  nombre = input.required<string>();
  descripcion = input.required<string>();
  precio = input.required<number>();
  imagenUrl = input<string>('');
    //Esto son los outputs, o eventos que nosotros vamos a enviar al padre, la tarjeta no realiza procesos como tal, solo muestra

  surtir = output<{ idProducto: string; idProveedor: string }>();
  eliminar = output<{ idProducto: string; idProveedor: string }>();

  clickSurtir(): void {
    this.surtir.emit({ idProducto: this.idProducto(), idProveedor: this.idProveedor() });
  }
  clickEliminar():void{
    this.eliminar.emit({ idProducto: this.idProducto(), idProveedor: this.idProveedor() });
  }
}
