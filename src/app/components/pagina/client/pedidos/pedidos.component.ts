import { Component,signal,computed, OnInit, inject } from '@angular/core';
import { ProductoPedidoComponent } from '../cards/producto-pedido/producto-pedido.component';
import { DetallesPedidoComponent } from '../modals/detalles-pedido/detalles-pedido.component';
import { PedidoCliente } from '../../../../Models/pedidoCliente';
import { PedidoClienteService } from '../../../../Services/pedidoCliente.service';
import { SesionService } from '../../../../Services/sesion.service';

@Component({
  selector: 'app-pedidos.component',
  imports: [ProductoPedidoComponent,DetallesPedidoComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  constructor(private pedidoClienteService:PedidoClienteService){}

  sesionService=inject(SesionService)
  pedidos = signal<PedidoCliente[]>([]);
  entregado = signal<boolean>(false);
  activo = signal<boolean>(true);
  buscador=signal<string>('');
  //Este objeto almacena en memoria (en dado caso) el pedido que fue seleccionado para ser visto con el modal de detalles
  pedidoSeleccionado = signal<PedidoCliente | null>(null);

  pedidosFiltrados = computed(() => {//Esta es la colección de productos o la lista de productos que el HTML usará para cargar las cards de productos, que se basa en los filtros
    return this.pedidos().filter(p => //que son ingresados por el usuario
      (p.cancelado!=this.activo())&&(p.entregado==this.entregado())&&(
      p.nombreCliente.toLowerCase().includes(this.buscador().toLowerCase())));
  });

  ngOnInit(): void {
    this.cargarPedidos();
  }
  cargarPedidos():void{
    const usuario=this.sesionService.usuarioActual()
    if(!usuario)return
    // .subscribe() es como decirle "cuando tengas la respuesta, avísame". El "next" se ejecuta
    // si todo salió bien, y el "error" se ejecuta si algo falló (el server tronó, no hay internet, etc)
    this.pedidoClienteService.obtenerPedidosCliente(usuario.idUsuario).subscribe({
      next: (pedidosRecibidos)=>{
        this.pedidos.set(pedidosRecibidos)
      },
      error: (error)=>{
        alert("No se pudieron cargar los pedidos")
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
    //
  }
}
