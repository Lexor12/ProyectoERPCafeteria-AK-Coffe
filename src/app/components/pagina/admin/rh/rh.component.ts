import { Component, signal, computed } from '@angular/core';
import { TrabajadorRhComponent } from '../cards/trabajador-rh/trabajador-rh.component';
import { AgregarEditarTrabajadorRhComponent } from '../modals/agregar-editar-trabajador-rh/agregar-editar-trabajador-rh.component';
import { AsistenciasTrabajadorRhComponent } from '../modals/asistencias-trabajador-rh/asistencias-trabajador-rh.component';
import { Trabajador } from '../../../../Models/trabajador.model';

@Component({
  selector: 'app-rh.component',
  imports: [TrabajadorRhComponent,AgregarEditarTrabajadorRhComponent, AsistenciasTrabajadorRhComponent],
  templateUrl: './rh.component.html',
  styleUrl: './rh.component.css',
})
export class RhComponent {
  //Estos idealmente se traen desde la base de datos, pero como aun no tenemos conexion, no quiero cagarla
  trabajadores = signal<Trabajador[]>([
    {
      idTrabajador: 't1a2b3c4-d5e6-7890-abcd-ef0123456789',
      nombre: 'Juan Carlos',
      apellido: 'López Pérez',
      area: 'Caja',
      fechaIngreso: '2026-10-04',
      salario: 240,
      rfc: 'LOPJ900101ABC',
      horaEntrada: '08:00',
      horaSalida: '16:00',
    },
    {
      idTrabajador: 't2b3c4d5-e6f7-8901-bcde-f01234567890',
      nombre: 'María Fernanda',
      apellido: 'Ramírez Solís',
      area: 'Cocina',
      fechaIngreso: '2026-03-12',
      salario: 260,
      rfc: 'RASM910212XYZ',
      horaEntrada: '09:00',
      horaSalida: '17:00',
    },
    {
      idTrabajador: 't3c4d5e6-f7g8-9012-cdef-012345678901',
      nombre: 'Luis Ángel',
      apellido: 'Morales Cruz',
      area: 'Logística',
      fechaIngreso: '2026-01-20',
      salario: 235,
      rfc: 'MOCL880515DEF',
      horaEntrada: '08:00',
      horaSalida: '16:00',
    },
  ]);

  areas = computed(() => [...new Set(this.trabajadores().map(t => t.area))]);

  areaSeleccionada = signal<string>('');
  buscador = signal<string>('');

  trabajadorEnEdicion = signal<Trabajador | null>(null);
  mostrarModalAgregar = signal<boolean>(false);
  trabajadorEnAsistencias = signal<Trabajador | null>(null);

  trabajadoresFiltrados = computed(() => {
    return this.trabajadores().filter(t =>
      (this.areaSeleccionada() === '' || t.area === this.areaSeleccionada()) &&
      (t.nombre + ' ' + t.apellido).toLowerCase().includes(this.buscador().toLowerCase())
    );
  });

  //Conversión de hora para mostrar en cards (24h -> "8:00 a.m")
  //Por defecto, se muestra en formato de 24h, y esto llega a ser cansado de leer, asi que lo convertimos a el formato a.m / p.m que yo entiendo mejor
  horaLegible(hora24: string): string {
    if (!hora24) return '';
    const [horasStr, minutosStr] = hora24.split(':');
    let horas = Number(horasStr);
    const sufijo = horas >= 12 ? 'p.m' : 'a.m';
    horas = horas % 12;
    if (horas === 0) horas = 12;
    return `${horas}:${minutosStr} ${sufijo}`;
  }

  actualizarArea(evento: Event): void {
    this.areaSeleccionada.set((evento.target as HTMLSelectElement).value);
  }

  actualizarBuscador(evento: Event): void {
    this.buscador.set((evento.target as HTMLInputElement).value);
  }

  desactivarTrabajador(idTrabajador: string): void {
    this.trabajadores.update(lista => lista.filter(t => t.idTrabajador !== idTrabajador));
  }

  editarTrabajador(idTrabajador: string): void {
    const trabajador = this.trabajadores().find(t => t.idTrabajador === idTrabajador);
    this.trabajadorEnEdicion.set(trabajador ?? null);
  }

  clickAgregarTrabajador(): void {
    this.mostrarModalAgregar.set(true);
  }

  cerrarModalTrabajador(): void {
    this.trabajadorEnEdicion.set(null);
    this.mostrarModalAgregar.set(false);
  }

  guardarTrabajador(datos: {
    idTrabajador: string; nombre: string; apellido: string; area: string; fechaIngreso: string;
    salario: number; rfc: string; horaEntrada: string; horaSalida: string;
  }): void {
    if (datos.idTrabajador) {//Como aun no tenemos la conexión con la base de datos, solo actualizamos aqui en el navegador, pero en un futuro se hará la consulta a la BD
      this.trabajadores.update(lista =>
        lista.map(t => t.idTrabajador === datos.idTrabajador
          ? {
              ...t,
              nombre: datos.nombre,
              apellido: datos.apellido,
              area: datos.area,
              fechaIngreso: datos.fechaIngreso,
              salario: datos.salario,
              rfc: datos.rfc,
              horaEntrada: datos.horaEntrada,
              horaSalida: datos.horaSalida,
            }
          : t
        )
      );
    } else {
      // Modo agregar: no hay id todavía, aquí lo generarías/lo pondría el backend
      console.log('Nuevo trabajador:', datos);
    }
    this.trabajadorEnEdicion.set(null);
    this.mostrarModalAgregar.set(false);
  }

  verAsistencias(idTrabajador: string): void {
    const trabajador = this.trabajadores().find(t => t.idTrabajador === idTrabajador);
    this.trabajadorEnAsistencias.set(trabajador ?? null);
  }

  registrarAsistencia(datos: { idTrabajador: string; horaEntrada: string; horaSalida: string }): void {
    console.log('Nueva asistencia para', datos.idTrabajador, datos.horaEntrada, datos.horaSalida);
  }

  descargarNomina(datos: { idTrabajador: string; fechaInicio: string; fechaFin: string }): void {
    console.log('Descargar nómina de', datos.idTrabajador, datos.fechaInicio, datos.fechaFin);
  }

  cerrarModalAsistencias(): void {
    this.trabajadorEnAsistencias.set(null);
  }
}