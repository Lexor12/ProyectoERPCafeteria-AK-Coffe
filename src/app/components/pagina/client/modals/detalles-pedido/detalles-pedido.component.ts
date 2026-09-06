import { Component,input,output,computed } from '@angular/core';

@Component({
  selector: 'app-detalles-pedido',
  imports: [],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.css',
})

export class DetallesPedidoComponent {
  nombreProducto = input.required<string>();
  descripcion = input.required<string>();
  cantidad = input.required<number>();
  precioUnitario = input.required<number>();
  entregado = input.required<boolean>();
  cancelado = input.required<boolean>();
  imagenUrl = input<string>('');

  nombreCliente = input.required<string>();
  apellidoCliente = input.required<string>();
  rfcCliente = input<string>(''); 

  nombreTienda = input.required<string>();
  rfcTienda = input.required<string>();
  telefonoTienda = input.required<string>();
  domicilioFiscalTienda = input.required<string>();
  regimenFiscalTienda = input.required<string>();

  cerrar = output<void>();

  subtotal = computed(() => this.cantidad() * this.precioUnitario());
  iva = computed(() => this.subtotal() * 0.16);
  precioTotal = computed(() => this.subtotal() + this.iva());

  proceso = computed(() => this.entregado() ? 'ENTREGADO' : 'PENDIENTE');
  estado = computed(() => this.cancelado() ? 'CANCELADO' : 'ACTIVO');

  clickCerrar(): void {
    this.cerrar.emit();//Como mandamos ningun dato al padre, solo la alerta para que cierre
  }
}
