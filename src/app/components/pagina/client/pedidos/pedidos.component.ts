import { Component,signal,computed, OnInit, inject } from '@angular/core';
import { ProductoPedidoComponent } from '../cards/producto-pedido/producto-pedido.component';
import { DetallesPedidoComponent } from '../modals/detalles-pedido/detalles-pedido.component';
import { PedidoCliente } from '../../../../Models/pedidoCliente';
import { PedidoClienteService } from '../../../../Services/pedidoCliente.service';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-pedidos.component',
  imports: [ProductoPedidoComponent,DetallesPedidoComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  constructor(private pedidoClienteService:PedidoClienteService){}

  authService=inject(AuthService)
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
    if(!this.authService.estaAutenticado())return
    // .subscribe() es como decirle "cuando tengas la respuesta, avísame". El "next" se ejecuta
    // si todo salió bien, y el "error" se ejecuta si algo falló (el server tronó, no hay internet, etc)
    this.pedidoClienteService.obtenerPedidosCliente().subscribe({
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
    //Buscamos el pedido en la lista actual por su id
    const pedido = this.pedidos().find(p => p.idVenta === idVenta);
    if (!pedido) {
      alert("No se encontró el pedido para generar la factura.");
      return;
    }

    //Calculamos los valores fiscales igual que en el componente de detalles
    const subtotal = pedido.productos.reduce((suma, p) => suma + p.subtotal, 0);//Reduce recorre la lista de productos del pedido para sumar todos los subtotales y obtener el subtotal general
    const iva = subtotal * 0.16;
    const precioTotal = subtotal + iva;

    const procesoTexto = pedido.entregado ? 'ENTREGADO' : 'PENDIENTE';
    const estadoTexto = pedido.cancelado ? 'CANCELADO' : 'ACTIVO';

    //Construimos el contenido XML con todos los datos integrados en el frontend
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <Comprobante version="1.0" idVenta="${pedido.idVenta}" fechaCompra="${pedido.fechaCompra}">
        <Tienda>
            <Nombre>${pedido.nombreTienda}</Nombre>
            <Rfc>${pedido.rfcTienda}</Rfc>
            <Telefono>${pedido.telefonoTienda}</Telefono>
            <DomicilioFiscal>${pedido.domicilioFiscalTienda}</DomicilioFiscal>
            <RegimenFiscal>${pedido.regimenFiscalTienda}</RegimenFiscal>
        </Tienda>
        <Cliente>
            <Nombre>${pedido.nombreCliente}</Nombre>
            <Apellido>${pedido.apellidoCliente}</Apellido>
            <Rfc>${pedido.rfcCliente || 'Sin RFC'}</Rfc>
        </Cliente>
        <EstadoPedido>
            <Entrega>${procesoTexto}</Entrega>
            <Estado>${estadoTexto}</Estado>
        </EstadoPedido>
        <Conceptos>
            ${pedido.productos.map(p => `
            <Producto>
                <Nombre>${p.nombre}</Nombre>
                <Cantidad>${p.cantidad}</Cantidad>
                <PrecioUnitario>${p.precioUnitario}</PrecioUnitario>
                <Subtotal>${p.subtotal}</Subtotal>
            </Producto>
            `).join('')}
        </Conceptos>
        <Totales>
            <SubtotalGeneral>${subtotal.toFixed(2)}</SubtotalGeneral>
            <Iva>${iva.toFixed(2)}</Iva>
            <PrecioTotal>${precioTotal.toFixed(2)}</PrecioTotal>
        </Totales>
    </Comprobante>`;

      //Creamos el Blob y forzamos la descarga del archivo XML
      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
      /*
      Un Blob (Binary Large Object) es un archivo virtual que se crea de manera temporal en la memoria RAM del navegador. 
      Aqí le paso el texto XML y le indico que su tipo de contenido MIME es application/xml con codificación de caracteres utf-8 para que respete acentos y ñ
      */
      const url = window.URL.createObjectURL(blob);//Creamos una URL para que apunte a ese objeto que acabamos de crear (para poder descargarlo)
      const link = document.createElement('a');//Creamos una etiqueta tipo a
      link.href = url;//Enlzamos la URL a la etiqueta
      link.download = `factura_AK_COFFE.xml`;//Designamos el nombre con el que se descarga
      
      link.click();//Ejecutamos este evento para que nos descargue automáticamente el archivo
      window.URL.revokeObjectURL(url);//Eliminamos el objeto para liberar memoria
  }
}
