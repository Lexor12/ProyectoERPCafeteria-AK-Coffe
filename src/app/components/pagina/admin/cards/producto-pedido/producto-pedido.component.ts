import { Component,input,output,computed } from '@angular/core';
@Component({
  selector: 'app-producto-pedido',
  imports: [],
  templateUrl: './producto-pedido.component.html',
  styleUrl: './producto-pedido.component.css',
})
export class ProductoPedidoComponent {
  //Definimos todas las propiedades posibles de una tarjeta, las cuales son las siguientes: (Estas se eligierón en base a los Mockups y lo que tiene la BD)
  idVenta = input.required<string>();
  nombreCliente = input.required<string>();
  apellidoCliente = input.required<string>();
  fechaCompra = input.required<string>();
  totalPagado = input.required<number>();
  entregado = input<boolean>(false);
  cancelado = input<boolean>(false);

  // Solo para mostrar algo rapido en la tarjeta sin listar los N productos completos
  verDetalle = output<string>();
  marcarEntregado = output<string>();
  marcarCancelado = output<string>();

  entregar(): void { this.marcarEntregado.emit(this.idVenta()); }
  cancelar(): void { this.marcarCancelado.emit(this.idVenta()); }
  detalles(): void { this.verDetalle.emit(this.idVenta()); }
}
