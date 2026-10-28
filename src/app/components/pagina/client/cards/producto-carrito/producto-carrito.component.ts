import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-carrito',
  imports: [],
  templateUrl: './producto-carrito.component.html',
  styleUrl: './producto-carrito.component.css',
})
// Como tal esta clase representa un producto dentro del carrito, solo muestra datos y avisa al padre cuando se quiere eliminar
export class ProductoCarritoComponent {
  // Datos que manda el carrito (padre), ya cruzados con el stock real
  idProducto=input.required<string>();
  nombre=input.required<string>();
  descripcion=input.required<string>();
  cantidad=input.required<number>();
  precio=input.required<number>();
  imagenUrl=input<string>('');

  subtotal=computed(()=>this.cantidad()*this.precio());// Cantidad por precio unitario, se recalcula solo si cambia alguno, en este caso como no cambia se mantiene

  eliminar=output<string>();// Manda el id al padre para que lo quite de la lista y del localStorage
  clickEliminarProducto():void{
    this.eliminar.emit(this.idProducto());
  }
}
