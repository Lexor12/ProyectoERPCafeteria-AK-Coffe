import { Component, signal, computed } from '@angular/core';
import { ProductoProveedorComponent } from '../cards/producto-proveedor/producto-proveedor.component';
import { SurtirProductoProveedorComponent } from '../modals/surtir-producto-proveedor/surtir-producto-proveedor.component';
import { AgregarProveedorComponent } from '../modals/agregar-proveedor/agregar-proveedor.component';
import { AgregarProductoProveedorComponent } from '../modals/agregar-producto-proveedor/agregar-producto-proveedor.component';
import { ProductoProveedor } from '../../../../Models/ProductoProveedor.model';

@Component({
  selector: 'app-proveedores.component',
  imports: [ProductoProveedorComponent,SurtirProductoProveedorComponent,AgregarProveedorComponent,AgregarProductoProveedorComponent ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css',
})
export class ProveedoresComponent {
  // Por ahora los proveedores están quemados aquí, a futuro esto debe venir de una consulta a la BD
  // (idealmente con su propio Model, igual que ProductoProveedor)
  proveedores = signal<{ idProveedor: string; nombre: string }[]>([
    { idProveedor: 'p1', nombre: 'Café del Valle' },
    { idProveedor: 'p2', nombre: 'Distribuidora Norte' },
  ]);

  // Igual que arriba, esta lista de productos por proveedor es solo de prueba,
  // en la Práctica 2 se traería del backend según el proveedor autenticado/seleccionado
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

  // Vacío significa "Todos" en el filtro (ver el <option value=""> del select en el HTML)
  proveedorSeleccionado = signal<string>('');
  buscador = signal<string>('');

  // Guarda el producto sobre el que se dio clic en "Surtir", el HTML revisa esta señal
  // con un @if para saber si abrir el modal de surtido o no
  productoASurtir = signal<ProductoProveedor | null>(null);
  mostrarModalAgregarProveedor = signal<boolean>(false);
  mostrarModalAgregarProducto = signal<boolean>(false);

  // Filtra por proveedor seleccionado (si está vacío no filtra nada) y por nombre del buscador,
  // se recalcula solo cuando cambia alguna de las tres señales que usa adentro
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

  // Busca el producto por id (el que manda la card) y lo guarda, esto hace que el @if
  // del HTML detecte el cambio y abra el modal de surtido con los datos de ese producto
  surtirProducto(idProducto: string): void {
    const producto = this.productos().find(p => p.idProducto === idProducto);
    this.productoASurtir.set(producto ?? null);
  }

  cerrarModalSurtir(): void {
    this.productoASurtir.set(null);
  }

  // Esta función se debe ampliar en la Práctica 2 para hacer la petición real al backend,
  // que actualice la cantidad disponible del producto en la BD (según RQF22/RQF23),
  // por ahora solo cierra el modal sin mandar nada a ningún lado
  confirmarSurtido(datos: { idProducto: string; cantidad: number }): void {
    this.productoASurtir.set(null);
  }

  clickAgregarProducto(): void {
    this.mostrarModalAgregarProducto.set(true);
  }

  cerrarModalProducto(): void {
    this.mostrarModalAgregarProducto.set(false);
  }

  // Aqui guardara productos en la base de datos, ya en un futuro se hará la consulta y se ingresarán los valores obtenidos del model
  // (falta distinguir con datos.productoExistente si es un producto nuevo o si solo se está
  // asociando uno ya existente a este proveedor, eso se resuelve en la Práctica 2)
  guardarProducto(datos: {
    productoExistente: boolean; idProveedor: string; idProductoExistente: string;
    nombre: string; descripcion: string; precioUnitario: number; imagen: File | null;
  }): void {
    this.mostrarModalAgregarProducto.set(false);
  }

  clickAgregarProveedor(): void {
    this.mostrarModalAgregarProveedor.set(true);
  }

  cerrarModalProveedor(): void {
    this.mostrarModalAgregarProveedor.set(false);
  }

  // Aqui guardara proveedores en la base de datos, ya en un futuro se hará la consulta y se ingresarán los valores obtenidos del model
  guardarProveedor(datos: { nombre: string; telefono: string }): void {
    this.mostrarModalAgregarProveedor.set(false);
  }
}