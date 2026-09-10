import { Component, OnInit, signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCarritoComponent } from '../cards/producto-carrito/producto-carrito.component';
import { isPlatformBrowser,CommonModule } from '@angular/common';
import { ProductoCarrito } from '../../../../Models/productoCarrito.model';

@Component({
  selector: 'app-carrito.component',
  imports: [ProductoCarritoComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent implements OnInit{
  platformId=inject(PLATFORM_ID)
  items = signal<ProductoCarrito[]>([]);
  //Vamos a suponer que tenemos, obviamente ya en la práctica 2 pues no será esto asi, deberá de haber una solicitud al servidor para obtener los valores:
  private productosOficiales = [
    { idProducto: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789', nombre: 'Café Americano', descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.', precio: 45.00, stockDisponible: 16, imagenUrl: 'images/cafe-americano.png' },
    { idProducto: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210', nombre: 'Capuchino Especial', descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.', precio: 58.50, stockDisponible: 10, imagenUrl: 'images/cafe-capuccino.png' },
    { idProducto: '12345678-abcd-ef01-2345-6789abcdef01', nombre: 'Latte Vainilla', descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.', precio: 65.00, stockDisponible: 8, imagenUrl: 'images/cafe-latte.png' },
  ];


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
    // aqui se redirige a PayPal en un futurito
  }

  ngOnInit(): void {
    this.cargarCarrito();
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
    const carritoMinimo = JSON.parse(localStorage.getItem('mi_carrito') || '[]');//Hacemos parse, ya que JSON guarda un string, y con parse yo transformo ese string a una diccionario
    const carritoCompleto: ProductoCarrito[] = carritoMinimo.map((itemMinimo: { idProducto: string; cantidad: number }) => {/*
      Como en el Catálogo se guarda lo equivalente a cierto ID, aqui en el carrito se hace otra petición al back y se muestra
      los datos de cada producto según si existen o no */
      const productoEncontrado = this.productosOficiales.find(p => p.idProducto === itemMinimo.idProducto);
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
