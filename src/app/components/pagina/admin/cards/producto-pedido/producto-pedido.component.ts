import { Component,input,output } from '@angular/core';

@Component({
  selector: 'app-producto-pedido',
  imports: [],
  templateUrl: './producto-pedido.component.html',
  styleUrl: './producto-pedido.component.css',
})
export class ProductoPedidoComponent {
  //Definimos todas las propiedades posibles de una tarjeta, las cuales son las siguientes: (Estas se eligierón en base a los Mockups y lo que tiene la BD)
  idVenta = input.required<string>();
  nombre = input.required<string>();
  nombreCliente = input.required<string>();
  precio = input.required<number>();
  cantidad = input.required<number>();
  fechaCompra = input.required<string>();
  entregado = input<boolean>(false);
  cancelado = input<boolean>(false);
  imagenUrl = input<string>('');
  //Esto son los outputs, o eventos que nosotros vamos a enviar al padre, la tarjeta no realiza procesos como tal, solo muestra
  marcarEntregado = output<string>();
  marcarCancelado = output<string>();

  entregar():void{
    this.marcarEntregado.emit(this.idVenta());
  }
  cancelar():void{
    this.marcarCancelado.emit(this.idVenta());
  }
}
