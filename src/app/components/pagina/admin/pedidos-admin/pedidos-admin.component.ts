import { Component, signal, computed, OnInit  } from '@angular/core';
import { ProductoPedidoComponent } from '../cards/producto-pedido/producto-pedido.component';
import { PedidoAdmin } from '../../../../Models/pedidoAdmin';
import { DetallesPedidoAdminComponent } from '../modals/detalles-pedido-admin/detalles-pedido-admin.component';
import { PedidoAdminService } from '../../../../Services/pedidoAdmin.service';


@Component({
  selector: 'app-pedidos-admin.component',
  imports: [ProductoPedidoComponent,DetallesPedidoAdminComponent],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css',
})
export class PedidosAdminComponent implements OnInit{
  constructor(private pedidoAdminService: PedidoAdminService) {}
  pedidos = signal<PedidoAdmin[]>([]);

  entregado = signal<boolean>(false);
  activo = signal<boolean>(true);
  buscador = signal<string>('');

  pedidoSeleccionado = signal<PedidoAdmin | null>(null);

  pedidosFiltrados = computed(() => {
    return this.pedidos().filter(p =>
      (p.cancelado != this.activo()) && (p.entregado == this.entregado()) && (
      p.nombreCliente.toLowerCase().includes(this.buscador().toLowerCase())));
  });

  ngOnInit(): void {
    this.cargarPedidos()
  }
  cargarPedidos():void{
    this.pedidoAdminService.obtenerPedidosAdmin().subscribe({
      next: (pedidosAdmin)=>{
        this.pedidos.set(pedidosAdmin)
      },
      error: (error)=>{
        alert('No se pudieron cargar los pedidos')
      }
    })
  }

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
    const pedido=this.pedidos().filter(p=>p.idVenta===idVenta)[0]
    this.pedidoAdminService.marcarCancelado(idVenta,!pedido.cancelado).subscribe({
      next: ()=>{
        this.cargarPedidos()
      },
      error: (error)=>{
        alert('No se pudo cancelar el pedido')
      }
    })
  }

  marcarEntregado(idVenta: string): void {
    const pedido=this.pedidos().filter(p=>p.idVenta===idVenta)[0]
    this.pedidoAdminService.marcarEntregado(idVenta, !pedido.entregado).subscribe({
      next: () => {
        this.cargarPedidos()
      },
      error: (error) => {
        alert('No se pudo marcar como entregado');
      }
    });
  }

  verDetalle(idVenta:string):void{
    const pedido = this.pedidos().find(p => p.idVenta === idVenta);
    this.pedidoSeleccionado.set(pedido ?? null);
  }

  cerrarModal(): void {
    this.pedidoSeleccionado.set(null);
  }
}
