import { Component, signal, computed  } from '@angular/core';
import { ProductoPedidoComponent } from '../cards/producto-pedido/producto-pedido.component';
import { PedidoAdmin } from '../../../../Models/pedidosAdmin';
@Component({
  selector: 'app-pedidos-admin.component',
  imports: [ProductoPedidoComponent],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css',
})
export class PedidosAdminComponent {
  pedidos = signal<PedidoAdmin[]>([
    {
      idVenta: 'a1b2c3d4-0001',
      nombre: 'Café Americano',
      precio: 123.50,
      cantidad: 1,
      fechaCompra: '04/10/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-americano.png',
      nombreCliente: 'Alondra López Zúñiga',
    },
    {
      idVenta: 'a1b2c3d4-0002',
      nombre: 'Capuchino Especial',
      precio: 58.50,
      cantidad: 1,
      fechaCompra: '02/10/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-capuccino.png',
      nombreCliente: 'Luis Ramírez',
    },
    {
      idVenta: 'a1b2c3d4-0003',
      nombre: 'Latte Vainilla',
      precio: 65.00,
      cantidad: 3,
      fechaCompra: '28/09/2026',
      entregado: false,
      cancelado: false,
      imagenUrl: 'images/cafe-latte.png',
      nombreCliente: 'María López',
    },
  ]);

  entregado = signal<boolean>(false); //Pendiente por defecto, cuadra con el radio "Pendiente" marcado
  activo = signal<boolean>(true);
  buscador = signal<string>('');

  pedidosFiltrados = computed(() => {
    return this.pedidos().filter(p =>
      (p.cancelado != this.activo()) && (p.entregado == this.entregado()) && (
      p.nombreCliente.toLowerCase().includes(this.buscador().toLowerCase())));
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

  cancelarPedido(idVenta: string): void {
    //Aquí eventualmente se llamaría al servicio para marcar como cancelado en la BD
    this.pedidos.update(lista =>
      lista.map(p => p.idVenta === idVenta ? { ...p, cancelado: true } : p)
    );
  }

  marcarEntregado(idVenta: string): void {
    //Aquí eventualmente se llamaría al servicio para marcar como entregado en la BD
    this.pedidos.update(lista =>
      lista.map(p => p.idVenta === idVenta ? { ...p, entregado: true } : p)
    );
  }
}
