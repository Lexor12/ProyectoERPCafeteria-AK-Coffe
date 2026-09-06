import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-producto-carrito',
  imports: [],
  templateUrl: './producto-carrito.component.html',
  styleUrl: './producto-carrito.component.css',
})
export class ProductoCarritoComponent {
  idProducto=input.required<string>();
  nombre=input.required<string>();
  descripcion=input.required<string>();
  cantidad=input.required<number>();
  precio=input.required<number>();
  imagenUrl=input<string>('');

  subtotal=computed(()=>this.cantidad()*this.precio());

  eliminar=output<string>();
  clickEliminarProducto():void{
    this.eliminar.emit(this.idProducto());
  }
}
