import { Component, OnInit, signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCarritoComponent } from '../cards/producto-carrito/producto-carrito.component';
import { isPlatformBrowser } from '@angular/common';
import { ProductoCarrito } from '../../../../Models/productoCarrito';
import { ProductoCarritoService } from '../../../../Services/productoCarrito.service';
import { VentaService } from '../../../../Services/venta.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { ItemCarrito } from '../../../../Models/itemCarrito';

@Component({
  selector: 'app-carrito.component',
  imports: [ProductoCarritoComponent,RouterLink,RouterLinkActive],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit{
  authService=inject(AuthService)
  confirmacionTerminos=signal<boolean>(false);
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

  actualizarTerminos(evento:Event){
    this.confirmacionTerminos.set((evento.target as HTMLInputElement).checked)
  }
  eliminarItem(idProducto: string): void {
    this.items.update(lista => lista.filter(item => item.idProducto !== idProducto));
    this.eliminarDelCarrito(idProducto);
  }

  actualizarRfc(evento: Event): void {
    this.rfc.set((evento.target as HTMLInputElement).value);
  }
  isProcessing: boolean = false;//Usamos esta variable para evitar 2 clics
  pagar():  void {
    if (this.items().length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    if(!this.authService.estaAutenticado()){
      alert('Ocurrio un error al verificar tu identidad, porfavor vuelve a acceder');
      return;
    }
    if(!this.confirmacionTerminos()){
      alert('No has aceptado los Términos y Condiciones y el Aviso de Privacidad');
      return;
    }
    // Antes de mandarlo a PayPal, armo un arreglo simple solo con lo que el backend necesita
    // saber: qué producto y cuánta cantidad, no hace falta mandarle todo el objeto completo
    const itemsParaValidar = this.items().map(item => ({
      idProducto: item.idProducto,
      cantidad: item.cantidad
    }));
    // Si ya se está procesando, evitamos cualquier doble ejecución
    if (this.isProcessing) return;
    // Bloqueamos el botón inmediatamente
    this.isProcessing = true;
    this.productoCarritoService.validarCarrito(itemsParaValidar).subscribe({
      next: (resultado) => {
        if (resultado.valido) {
          // aqui se redirige a PayPal en un futurito
          this.ventaService.registrarVenta(this.rfc(),this.confirmacionTerminos(), itemsParaValidar).subscribe({
            next: (respuestaVenta) => {
              if (respuestaVenta.iniciado && respuestaVenta.enlacePago) {
                if (!isPlatformBrowser(this.platformId)) return;
                sessionStorage.setItem('paypal_order_id', respuestaVenta.orderID);
                sessionStorage.setItem('paypal_items', JSON.stringify(itemsParaValidar));
                sessionStorage.setItem('paypal_rfc', this.rfc());
                // Vaciamos el carrito local
                //localStorage.setItem('mi_carrito', JSON.stringify([]));
                // REDIRIGIMOS A PAYPAL
                alert('Estamos redirigiendote....Espera un momento!')
                window.location.href = respuestaVenta.enlacePago;
              }else this.isProcessing = false;
            },
            error: (error) => {
              this.isProcessing = false;
              alert(error.error?.mensaje ?? 'Error al registrar la venta')
            }
          });
        } else {
          this.isProcessing = false;
          alert('Hay productos que ya no tienen suficiente stock');
          if(!isPlatformBrowser(this.platformId))return
          localStorage.setItem('mi_carrito', JSON.stringify([]));
        }
      },
      error: (error) => {
        this.isProcessing = false;
        alert(error.error?.mensaje ?? 'No se pudo validar el carrito')
        if(!isPlatformBrowser(this.platformId))return
        //Vaciamos el carrito
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
        alert(error.error?.mensaje ?? 'No se pudo cargar el catálogo del carrito')
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
    let huboAjuste = false; // Para saber si hace falta reescribir el localStorage al final

    const carritoCompleto: ProductoCarrito[] = carritoMinimo.map((itemMinimo: { idProducto: string; cantidad: number }) => {
      const productoEncontrado = this.productosOficiales().find(p => p.idProducto === itemMinimo.idProducto);

      //si la cantidad guardada excede el stock disponible actual, la recortamos
      // al máximo disponible. Si el producto ya no existe o no tiene stock, se tratará
      // como 0 y luego se descarta del carrito por completo (ver filter de abajo)
      let cantidadAjustada = itemMinimo.cantidad;
      if (productoEncontrado) {
        if (cantidadAjustada > productoEncontrado.stockDisponible) {
          cantidadAjustada = productoEncontrado.stockDisponible;
          huboAjuste = true;
        }
      } else {
        cantidadAjustada = 0;
        huboAjuste = true;
      }

      return {
        ...(productoEncontrado || {
          idProducto: itemMinimo.idProducto,
          nombre: 'Producto Desconocido',
          descripcion: '',
          precio: 0,
          stockDisponible: 0,
          imagenUrl: ''
        }),
        cantidad: cantidadAjustada
      };
    }).filter((item: ProductoCarrito) => item.cantidad > 0);
    //ningún producto en el carrito debe quedar con cantidad menor a 1, así que
    // si algo quedó en 0 (sin stock o producto inexistente), se elimina del carrito directo

    this.items.set(carritoCompleto);

    // Si hubo algún ajuste (recorte de cantidad o eliminación por falta de stock),
    // guardamos el carrito ya corregido de vuelta en localStorage, para que quede
    // persistido y no se vuelva a mostrar la cantidad vieja al recargar la página
    if (huboAjuste) {
      const carritoParaGuardar = carritoCompleto.map((item: ProductoCarrito) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad
      }));
      localStorage.setItem('mi_carrito', JSON.stringify(carritoParaGuardar));
      alert('Algunos productos de tu carrito fueron ajustados porque ya no tienen suficiente stock disponible');
    }
  }
  eliminarDelCarrito(idProducto:string): void {//Para eliminar un producto del carrito lo que se hace es obtener los elementos del localstorage
    if(!isPlatformBrowser(this.platformId))return
    const carritoActual: ItemCarrito[] = JSON.parse(localStorage.getItem('mi_carrito') || '[]');//y después filtrar para eliminar el id del producto a borrar
    const carritoActualizado = carritoActual.filter((item) => item.idProducto !== idProducto);
    localStorage.setItem('mi_carrito', JSON.stringify(carritoActualizado));//y al final volvemos a guardar en localStorage para actualizarlo (ya sea en caso de reiniciar la página o volver al catálogo)
  }
}
