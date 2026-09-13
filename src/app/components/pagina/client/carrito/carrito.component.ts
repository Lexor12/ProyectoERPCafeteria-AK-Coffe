import { Component, OnInit, signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCarritoComponent } from '../cards/producto-carrito/producto-carrito.component';
import { isPlatformBrowser,CommonModule } from '@angular/common';
import { ProductoCarrito } from '../../../../Models/productoCarrito';
import { ProductoCarritoService } from '../../../../Services/productoCarrito.service';
import { VentaService } from '../../../../Services/venta.service';
import { SesionService } from '../../../../Services/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito.component',
  imports: [ProductoCarritoComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit{
  sesionService=inject(SesionService)

  platformId=inject(PLATFORM_ID)
  constructor(private productoCarritoService: ProductoCarritoService,private ventaService:VentaService,private router:Router) {}

  items = signal<ProductoCarrito[]>([]);

  // Ya no tengo el arreglo fijo de productosOficiales, ahora se llena cuando responda el backend,
  // esta variable guarda esa respuesta mientras arma el carrito completo en cargarCarrito()
  productosOficiales = signal<ProductoCarrito[]>([]);


  rfc = signal<string>('');//Por defecto, el RFC esta vacia, y es una opcíon que el cliente puede poner por pedido /venta
  //decidí que sea opcional ya que no siempre una persona quiere facturá, y el hecho de ingresar un RFC pues puede sentirse como inseguro parra un cliente
  //entonces, no es como que algo obligatorio, solo si quieres factura

  subtotal = computed(() => this.items().reduce((suma, item) => suma + item.cantidad * item.precio, 0));
  iva = computed(() => this.subtotal() * 0.16); // Aqui si o si debemos aplicar el IVA al total de los productos
  total = computed(() => this.subtotal() + this.iva());

  eliminarItem(idProducto: string): void {
    this.items.update(lista => lista.filter(item => item.idProducto !== idProducto));
    this.eliminarDelCarrito(idProducto);
  }

  actualizarRfc(evento: Event): void {
    this.rfc.set((evento.target as HTMLInputElement).value);
  }

  pagar(): void {
    if (this.items().length === 0) {
      return;
    }
    const usuario=this.sesionService.usuarioActual()
    if(!usuario)return

    // Antes de mandarlo a PayPal, armo un arreglo simple solo con lo que el backend necesita
    // saber: qué producto y cuánta cantidad, no hace falta mandarle todo el objeto completo
    const itemsParaValidar = this.items().map(item => ({
      idProducto: item.idProducto,
      cantidad: item.cantidad
    }));

    this.productoCarritoService.validarCarrito(itemsParaValidar).subscribe({
      next: (resultado) => {
        if (resultado.valido) {
          // aqui se redirige a PayPal en un futurito
          this.ventaService.registrarVenta(usuario.idUsuario, this.rfc(), itemsParaValidar).subscribe({
            next: (respuestaVenta) => {
              if (respuestaVenta.registrada) {
                // Aqui ya podrías vaciar el carrito y redirigir a "Mis pedidos"
                if(!isPlatformBrowser(this.platformId))return
                localStorage.setItem('mi_carrito', JSON.stringify([]));
                this.router.navigate(['/pedidos']);
              } else {
                alert('No se pudo registrar la venta');
              }
            },
            error: (error) => {
              alert('Error al registrar la venta');
            }
          });
        } else {
          alert('Hay productos que ya no tienen suficiente stock');
          if(!isPlatformBrowser(this.platformId))return
          localStorage.setItem('mi_carrito', JSON.stringify([]));
        }
      },
      error: (error) => {
        alert('No se pudo validar el carrito');
        if(!isPlatformBrowser(this.platformId))return
        localStorage.setItem('mi_carrito', JSON.stringify([]));
      }
    });
  }

  ngOnInit(): void {
    this.cargarCatalogoOficial();
  }

  // Esta función nueva pide al backend la lista real de productos (con su precio y stock actuales),
  // y hasta que esa respuesta llega, llamo a cargarCarrito(), porque cargarCarrito necesita
  // productosOficiales ya lleno para poder cruzarlo con lo que hay en localStorage
  cargarCatalogoOficial(): void {
    if(!isPlatformBrowser(this.platformId))return
    this.productoCarritoService.obtenerProductosCarrito().subscribe({
      next: (productosRecibidos) => {
        this.productosOficiales.set(productosRecibidos);
        this.cargarCarrito();
      },
      error: (error) => {
        alert('No se pudo cargar el catálogo del carrito');
        localStorage.setItem('mi_carrito', JSON.stringify([]));
      }
    });
  }

  cargarCarrito(): void {/*Resumen, esta función utiliza local storage para leer lo que en la fase previa
    que es Catalogo se seleccionó para comprar y agregar al carrito, en este caso, usamos isPlatformBrowser para
    que no tengamos error aqui en Angular CLI al momento de ejecutar el proyecto, ya que sale el error de:
    "No existe localStorage", y efectivamente no existe porque esto es el navegador y como Angular es un poco "raro"
    ya que este ejecuta todo el proyecto y despues manda la versión al cliente ya full renderizado, entonces como localStorage
    no existe aqui en el entorno da problemas pero en un navegador no da error, es algo raro, porque ya tiene que ver más
    con el funcionamiento de Angular, pero si o si deberia de hacer el if para evitar problemas
    */
    if(!isPlatformBrowser(this.platformId))return
    const carritoMinimo = JSON.parse(localStorage.getItem('mi_carrito') || '[]');
    const carritoCompleto: ProductoCarrito[] = carritoMinimo.map((itemMinimo: { idProducto: string; cantidad: number }) => {
      // Ya no busco en un arreglo fijo, ahora busco en la lista que llegó del backend
      const productoEncontrado = this.productosOficiales().find(p => p.idProducto === itemMinimo.idProducto);
      return {
        ...(productoEncontrado || {
          idProducto: itemMinimo.idProducto,
          nombre: 'Producto Desconocido',
          descripcion: '',
          precio: 0,
          stockDisponible: 0,
          imagenUrl: ''
        }),
        cantidad: itemMinimo.cantidad
      };
    });
    this.items.set(carritoCompleto);
  }
  eliminarDelCarrito(idProducto:string): void {//Para eliminar un producto del carrito lo que se hace es obtener los elementos del localstorage
    if(!isPlatformBrowser(this.platformId))return
    const carritoActual = JSON.parse(localStorage.getItem('mi_carrito') || '[]');//y después filtrar para eliminar el id del producto a borrar
    const carritoActualizado = carritoActual.filter((item: any) => item.idProducto !== idProducto);
    localStorage.setItem('mi_carrito', JSON.stringify(carritoActualizado));//y al final volvemos a guardar en localStorage para actualizarlo (ya sea en caso de reiniciar la página o volver al catálogo)
  }
}
