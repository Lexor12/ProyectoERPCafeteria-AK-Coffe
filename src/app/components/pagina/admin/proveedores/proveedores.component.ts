import { Component, signal, computed } from '@angular/core';
import { ProductoProveedorComponent } from '../cards/producto-proveedor/producto-proveedor.component';
import { SurtirProductoProveedorComponent } from '../modals/surtir-producto-proveedor/surtir-producto-proveedor.component';
import { AgregarProveedorComponent } from '../modals/agregar-proveedor/agregar-proveedor.component';
import { AgregarProductoProveedorComponent } from '../modals/agregar-producto-proveedor/agregar-producto-proveedor.component';

interface ProductoProveedor {
  idProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  idProveedor: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-proveedores.component',
  imports: [ProductoProveedorComponent,SurtirProductoProveedorComponent,AgregarProveedorComponent,AgregarProductoProveedorComponent ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css',
})
export class ProveedoresComponent {
  proveedores = signal<{ idProveedor: string; nombre: string }[]>([
    { idProveedor: 'p1', nombre: 'Café del Valle' },
    { idProveedor: 'p2', nombre: 'Distribuidora Norte' },
  ]);

  productos = signal<ProductoProveedor[]>([
    {
      idProducto: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
      nombre: 'Café Americano',
      descripcion: 'Bebida caliente que se prepara combinando un espresso con agua caliente.',
      precio: 123.50,
      idProveedor: 'p1',
      imagenUrl: 'images/cafe-americano.png'
    },
    {
      idProducto: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
      nombre: 'Capuchino Especial',
      descripcion: 'Espresso con leche texturizada al vapor y una densa capa de espuma cremosa.',
      precio: 58.50,
      idProveedor: 'p2',
      imagenUrl: 'images/cafe-capuccino.png'
    },
    {
      idProducto: '12345678-abcd-ef01-2345-6789abcdef01',
      nombre: 'Latte Vainilla',
      descripcion: 'Suave mezcla de espresso, leche caliente y un toque de jarabe de vainilla artesanal.',
      precio: 65.00,
      idProveedor: 'p1',
      imagenUrl: 'images/cafe-latte.png'
    },
  ]);

  proveedorSeleccionado = signal<string>('');
  buscador = signal<string>('');

  productoASurtir = signal<ProductoProveedor | null>(null);
  mostrarModalAgregarProveedor = signal<boolean>(false);
  mostrarModalAgregarProducto = signal<boolean>(false);

  productosFiltrados = computed(() => {
    return this.productos().filter(p =>
      (this.proveedorSeleccionado() === '' || p.idProveedor === this.proveedorSeleccionado()) &&
      p.nombre.toLowerCase().includes(this.buscador().toLowerCase())
    );
  });

  actualizarProveedor(evento: Event): void {
    this.proveedorSeleccionado.set((evento.target as HTMLSelectElement).value);
  }

  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }

  surtirProducto(idProducto: string): void {
    const producto = this.productos().find(p => p.idProducto === idProducto);
    this.productoASurtir.set(producto ?? null);
  }

  cerrarModalSurtir(): void {
    this.productoASurtir.set(null);
  }

  confirmarSurtido(datos: { idProducto: string; cantidad: number }): void {
    //Aquí eventualmente iría la llamada al servicio para actualizar el stock en la BD
    this.productoASurtir.set(null);
  }

  clickAgregarProducto(): void {
    this.mostrarModalAgregarProducto.set(true);
  }

  cerrarModalProducto(): void {
    this.mostrarModalAgregarProducto.set(false);
  }

  guardarProducto(datos: {
    productoExistente: boolean; idProveedor: string; idProductoExistente: string;
    nombre: string; descripcion: string; precioUnitario: number; imagen: File | null;
  }): void {
    //Aqui guardara productos
    this.mostrarModalAgregarProducto.set(false);
  }

  clickAgregarProveedor(): void {
    this.mostrarModalAgregarProveedor.set(true);
  }

  cerrarModalProveedor(): void {
    this.mostrarModalAgregarProveedor.set(false);
  }

  guardarProveedor(datos: { nombre: string; telefono: string }): void {
    //Aqui guardara proveedores
    this.mostrarModalAgregarProveedor.set(false);
  }
}
