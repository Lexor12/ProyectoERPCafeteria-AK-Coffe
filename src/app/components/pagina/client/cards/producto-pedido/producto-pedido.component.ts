import { Component,input,output } from '@angular/core';

@Component({
  selector: 'app-producto-pedido',
  imports: [],
  templateUrl: './producto-pedido.component.html',
  styleUrl: './producto-pedido.component.css',
})
export class ProductoPedidoComponent {
  idVenta = input.required<string>();
  nombre = input.required<string>();
  precio = input.required<number>();
  cantidad = input.required<number>();
  fechaCompra = input.required<string>();
  entregado = input<boolean>(false);
  cancelado = input<boolean>(false);
  imagenUrl = input<string>('');

  verDetalle = output<string>();
  descargarFactura = output<string>();

  detalles():void{
    this.verDetalle.emit(this.idVenta());
  }
  descargar():void{
    this.descargarFactura.emit(this.idVenta());
  }
}
