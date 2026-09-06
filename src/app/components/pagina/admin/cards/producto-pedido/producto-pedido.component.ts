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

  marcarEntregado = output<string>();
  marcarCancelado = output<string>();

  entregar():void{
    this.marcarEntregado.emit(this.idVenta());
  }
  cancelar():void{
    this.marcarCancelado.emit(this.idVenta());
  }
}
