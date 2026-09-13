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
  fechaCompra = input.required<string>();
  totalPagado = input.required<number>();
  entregado = input<boolean>(false);
  cancelado = input<boolean>(false);
  nombreCliente = input.required<string>();
  apellidoCliente = input.required<string>();

  verDetalle = output<string>();
  descargarFactura = output<string>();

  detalles(): void { this.verDetalle.emit(this.idVenta()); }
  descargar(): void { this.descargarFactura.emit(this.idVenta()); }
}
