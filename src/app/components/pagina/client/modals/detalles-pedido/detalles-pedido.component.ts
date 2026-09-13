import { Component,input,output,computed } from '@angular/core';
import { ProductoDeVenta } from '../../../../../Models/productoDeVenta';
@Component({
  selector: 'app-detalles-pedido',
  imports: [],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.css',
})

export class DetallesPedidoComponent {
  //Resumen, simplemente tenemos muchas propiedades que reciben datos del padre, y todas estas solo se muestran, no hay actualizaciones
  //simplemente se muestran los datos
  productos = input.required<ProductoDeVenta[]>();
  
  entregado = input.required<boolean>();
  cancelado = input.required<boolean>();


  nombreCliente = input.required<string>();
  apellidoCliente = input.required<string>();
  rfcCliente = input<string>(''); 

  //Estos datos de la tienda son fijos para todos los pedidos, a futuro deberían venir de una
  //configuración general del negocio en la BD, no repetirse en cada pedido individual
  nombreTienda = input.required<string>();
  rfcTienda = input.required<string>();
  telefonoTienda = input.required<string>();
  domicilioFiscalTienda = input.required<string>();
  regimenFiscalTienda = input.required<string>();

  cerrar = output<void>();

  subtotal = computed(() => this.productos().reduce((suma, p) => suma + p.subtotal, 0));
  iva = computed(() => this.subtotal() * 0.16);
  precioTotal = computed(() => this.subtotal() + this.iva());

  //Convertimos el booleano a texto legible para que el HTML no tenga que hacer ese ternario directo en el template
  proceso = computed(() => this.entregado() ? 'ENTREGADO' : 'PENDIENTE');
  estado = computed(() => this.cancelado() ? 'CANCELADO' : 'ACTIVO');

  clickCerrar(): void {
    this.cerrar.emit();//Como no mandamos ningún dato al padre, solo la alerta para que cierre
  }
}