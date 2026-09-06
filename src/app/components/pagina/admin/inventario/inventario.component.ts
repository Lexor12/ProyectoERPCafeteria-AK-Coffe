import { Component,computed,signal } from '@angular/core';
import { ProductoInventarioComponent } from '../cards/producto-inventario/producto-inventario.component';
import { EditarProductoInventarioComponent } from '../modals/editar-producto-inventario/editar-producto-inventario.component';

interface ProductoInventario {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
}

@Component({
  selector: 'app-inventario.component',
  imports: [ProductoInventarioComponent,EditarProductoInventarioComponent],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent {
  productos = signal<ProductoInventario[]>([
    {
      idProducto: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
      nombre: 'Café Americano',
      descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.',
      precio: 123.50,
      stock: 16,
      imagenUrl: 'images/cafe-americano.png'
    },
    {
      idProducto: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
      nombre: 'Capuchino Especial',
      descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.',
      precio: 58.50,
      stock: 10,
      imagenUrl: 'images/cafe-capuccino.png'
    },
    {
      idProducto: '12345678-abcd-ef01-2345-6789abcdef01',
      nombre: 'Latte Vainilla',
      descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.',
      precio: 65.00,
      stock: 8,
      imagenUrl: 'images/cafe-latte.png'
    },
  ]);

  precioMin = signal<number | null>(null);
  precioMax = signal<number | null>(null);
  buscador = signal<string>('');
  
  productoSeleccionado = signal<ProductoInventario | null>(null);

  productosFiltrados = computed(() => {
    return this.productos().filter(p =>
      (this.precioMin() === null || p.precio >= this.precioMin()!) &&
      (this.precioMax() === null || p.precio <= this.precioMax()!) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())
    );
  });

  actualizarPrecioMin(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.precioMin.set(valor ? Number(valor) : null);
  }

  actualizarPrecioMax(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.precioMax.set(valor ? Number(valor) : null);
  }

  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }

  desactivarProducto(idProducto: string): void {
    this.productos.update(lista => lista.filter(p => p.idProducto !== idProducto));
  }
  
  editarProducto(idProducto: string): void {
    const producto = this.productos().find(p => p.idProducto === idProducto);
    this.productoSeleccionado.set(producto ?? null);
  }
  
  cerrarModal(): void {
    this.productoSeleccionado.set(null);
  }
  
  guardarEdicion(datos: { idProducto: string; nombre: string; descripcion: string; precioUnitario: number }): void {
    this.productos.update(lista =>
      lista.map(p => p.idProducto === datos.idProducto
        ? { ...p, nombre: datos.nombre, descripcion: datos.descripcion, precio: datos.precioUnitario }
        : p
      )
    );
    this.productoSeleccionado.set(null);
  }
}
