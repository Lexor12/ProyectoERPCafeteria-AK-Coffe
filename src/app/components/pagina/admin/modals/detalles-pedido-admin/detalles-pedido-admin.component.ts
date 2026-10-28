import { Component,input,output,computed } from '@angular/core';
import { ProductoDeVenta } from '../../../../../Models/productoDeVenta';
@Component({
  selector: 'app-detalles-pedido-admin',
  imports: [],
  templateUrl: './detalles-pedido-admin.component.html',
  styleUrl: './detalles-pedido-admin.component.css',
})

//Este modal se encarga de mostrar el detalle de un pedido para el administrador, solo muestra datos que manda el padre
export class DetallesPedidoAdminComponent {
  productos = input.required<ProductoDeVenta[]>();

  entregado = input.required<boolean>();
  cancelado = input.required<boolean>();

  nombreCliente = input.required<string>();
  apellidoCliente = input.required<string>();
  fechaCompra = input.required<string>();
  cerrar = output<void>();

  //El subtotal, el IVA (16%) y total se calculan a partir de los productos del pedido
  subtotal = computed(() => this.productos().reduce((suma, p) => suma + p.subtotal, 0));
  iva = computed(() => this.subtotal() * 0.16);
  precioTotal = computed(() => this.subtotal() + this.iva());

  proceso = computed(() => this.entregado() ? 'ENTREGADO' : 'PENDIENTE');
  estado = computed(() => this.cancelado() ? 'CANCELADO' : 'ACTIVO');

  clickCerrar(): void {
    this.cerrar.emit();
  }
}
