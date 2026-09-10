import { Component,signal,computed } from '@angular/core';
import { ProductoPedidoComponent } from '../cards/producto-pedido/producto-pedido.component';
import { DetallesPedidoComponent } from '../modals/detalles-pedido/detalles-pedido.component';
import { PedidoCliente } from '../../../../Models/pedidoCliente';

@Component({
  selector: 'app-pedidos.component',
  imports: [ProductoPedidoComponent,DetallesPedidoComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent {
  pedidos = signal<PedidoCliente[]>([
    {
      idVenta: 'a1b2c3d4-0001',
      nombre: 'Café Americano',
      descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.',
      precio: 45.00,
      cantidad: 2,
      fechaCompra: '04/10/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-americano.png',
      rfcCliente: 'JUPE900101XXX',
      nombreCliente: 'Alondra',
      apellidoCliente: 'López Zúñiga',
      nombreTienda: 'AK Coffee',
      rfcTienda: 'AKC230115M3A',
      telefonoTienda: '3344556677',
      domicilioFiscalTienda: 'Av. Patria 1234, Col. Altamira, C.P. 45116, Zapopan, Jalisco',
      regimenFiscalTienda: '626 - Régimen Simplificado de Confianza (RESICO)',
    },
    {
      idVenta: 'a1b2c3d4-0002',
      nombre: 'Capuchino Especial',
      descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.',
      precio: 58.50,
      cantidad: 1,
      fechaCompra: '02/10/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-capuccino.png',
      rfcCliente: '', // opcional, este cliente no lo capturo
      nombreCliente: 'Alondra',
      apellidoCliente: 'López Zúñiga',
      nombreTienda: 'AK Coffee',
      rfcTienda: 'AKC230115M3A',
      telefonoTienda: '3344556677',
      domicilioFiscalTienda: 'Av. Patria 1234, Col. Altamira, C.P. 45116, Zapopan, Jalisco',
      regimenFiscalTienda: '626 - Régimen Simplificado de Confianza (RESICO)',
    },
    {
      idVenta: 'a1b2c3d4-0003',
      nombre: 'Latte Vainilla',
      descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.',
      precio: 65.00,
      cantidad: 3,
      fechaCompra: '28/09/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-latte.png',
      rfcCliente: 'JUPE900101XXX',
      nombreCliente: 'Alondra',
      apellidoCliente: 'López Zúñiga',
      nombreTienda: 'AK Coffee',
      rfcTienda: 'AKC230115M3A',
      telefonoTienda: '3344556677',
      domicilioFiscalTienda: 'Av. Patria 1234, Col. Altamira, C.P. 45116, Zapopan, Jalisco',
      regimenFiscalTienda: '626 - Régimen Simplificado de Confianza (RESICO)',
    },
  ]);

  entregado = signal<boolean>(false);
  activo = signal<boolean>(true);
  buscador=signal<string>('');
  //Este objeto almacena en memoria (en dado caso) el pedido que fue seleccionado para ser visto con el modal de detalles
  pedidoSeleccionado = signal<PedidoCliente | null>(null);

  pedidosFiltrados = computed(() => {//Esta es la colección de productos o la lista de productos que el HTML usará para cargar las cards de productos, que se basa en los filtros
    return this.pedidos().filter(p => //que son ingresados por el usuario
      (p.cancelado!=this.activo())&&(p.entregado==this.entregado())&&(
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())));
  });


  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }
  cambiarFiltroActivo(estado: boolean): void {
    this.activo.set(estado);
  }

  cambiarFiltroEntregado(estado: boolean): void {
    this.entregado.set(estado);
  }
  verDetalle(idVenta: string): void {//En el momento en que una card notifica que el usuario hizo clic sobre ella en ver detalles
    //se recibe el id del pedido, y se busca en la lista, una vez que se encuentra se setea la venta a la variable de pedidoSeleccionado,
    //como es signal, al momento de sobreescribirse genera una Alerta y el HTML lo muestra ya que digamos que "se reenderiza" y como ya no es null pedidoSeleccionado
    //pues nadamás carga sus datos
    const pedido = this.pedidos().find(p => p.idVenta === idVenta);
    this.pedidoSeleccionado.set(pedido ?? null);
  }
  cerrarModal(): void {
    this.pedidoSeleccionado.set(null);
  }

  descargarFactura(idVenta: string): void {
    console.log('Descargando factura de', idVenta);
  }
}
