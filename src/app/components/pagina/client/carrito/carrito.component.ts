import { Component, OnInit, signal,computed, inject, PLATFORM_ID } from '@angular/core';
import { ProductoCarritoComponent } from '../cards/producto-carrito/producto-carrito.component';
import { isPlatformBrowser,CommonModule } from '@angular/common';
interface ProductoCarrito {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stockDisponible: number;
  imagenUrl: string;
  cantidad: number;
}

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


  rfc = signal<string>('');

  subtotal = computed(() => this.items().reduce((suma, item) => suma + item.cantidad * item.precio, 0));
  iva = computed(() => this.subtotal() * 0.16); // RQF36: IVA aplicado
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
  cargarCarrito(): void {
    if(!isPlatformBrowser(this.platformId))return
    const carritoMinimo = JSON.parse(localStorage.getItem('mi_carrito') || '[]');
    const carritoCompleto: ProductoCarrito[] = carritoMinimo.map((itemMinimo: { idProducto: string; cantidad: number }) => {
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
  eliminarDelCarrito(idProducto:string): void {
    if(!isPlatformBrowser(this.platformId))return
    const carritoActual = JSON.parse(localStorage.getItem('mi_carrito') || '[]');
    const carritoActualizado = carritoActual.filter((item: any) => item.idProducto !== idProducto);
    localStorage.setItem('mi_carrito', JSON.stringify(carritoActualizado));
  }
}
