import { Component, signal, computed, OnInit } from '@angular/core';
import { TrabajadorRhComponent } from '../cards/trabajador-rh/trabajador-rh.component';
import { AgregarEditarTrabajadorRhComponent } from '../modals/agregar-editar-trabajador-rh/agregar-editar-trabajador-rh.component';
import { AsistenciasTrabajadorRhComponent } from '../modals/asistencias-trabajador-rh/asistencias-trabajador-rh.component';
import { Trabajador } from '../../../../Models/trabajador';
import { TrabajadorService } from '../../../../Services/trabajador.service';

@Component({
  selector: 'app-rh.component',
  imports: [TrabajadorRhComponent,AgregarEditarTrabajadorRhComponent, AsistenciasTrabajadorRhComponent],
  templateUrl: './rh.component.html',
  styleUrl: './rh.component.css',
})
export class RhComponent implements OnInit{
  //Ya por fin se traen de la base de datos los valores!!
  constructor(private trabajadorService: TrabajadorService) {}

  trabajadores = signal<Trabajador[]>([]);

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

  ngOnInit(): void {//Aqui cargamos todos los valores de Trabajadores del arreglo de arriba
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.trabajadorService.obtenerTrabajadores().subscribe({
      next: (trabajadoresRecibidos) => {
        this.trabajadores.set(trabajadoresRecibidos);//Justo aqui es donde se asigna el resultado en formato lista de Trabjador al signal del componente
      },
      error: (error) => {
        alert('No se pudieron cargar los trabajadores');
      }
    });
  }

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
  // De aqui para abajo, son funciones QUE SI requieren un proceso en la base de datos
  desactivarTrabajador(idTrabajador: string): void {
    this.trabajadorService.cambiarActivoTrabajador(idTrabajador, false).subscribe({
      next: () => {
        this.trabajadores.update(lista => lista.filter(t => t.idTrabajador !== idTrabajador));
      },
      error: (error) => {
        alert('No se pudo desactivar el trabajador');
      }
    });
  }

  guardarTrabajador(datos: {
    idTrabajador: string; nombre: string; apellido: string; area: string; fechaIngreso: string;
    salario: number; rfc: string; horaEntrada: string; horaSalida: string;
  }): void {
    const datosParaEnviar = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      area: datos.area,
      fechaIngreso: datos.fechaIngreso,
      salario: datos.salario,
      rfc: datos.rfc,
      horaEntrada: datos.horaEntrada,
      horaSalida: datos.horaSalida,
    };
    if (datos.idTrabajador) {
      // Modo editar: ya existe un idTrabajador
      this.trabajadorService.editarTrabajador(datos.idTrabajador, datosParaEnviar).subscribe({
        next: () => {
          this.trabajadores.update(lista =>
            lista.map(t => t.idTrabajador === datos.idTrabajador
              ? { ...t, ...datosParaEnviar }
              : t
            )
          );
          this.trabajadorEnEdicion.set(null);
          this.mostrarModalAgregar.set(false);
        },
        error: (error) => {
          alert('No se pudo editar el trabajador');
        }
      });
    } else {
      // Modo agregar: no hay id todavía, lo genera el backend
      this.trabajadorService.crearTrabajador(datosParaEnviar).subscribe({
        next: () => {
          this.cargarTrabajadores();
          this.mostrarModalAgregar.set(false);
        },
        error: (error) => {
          alert('No se pudo registrar el trabajador');
        }
      });
    }
  }

  verAsistencias(idTrabajador: string): void {
    const trabajador = this.trabajadores().find(t => t.idTrabajador === idTrabajador);
    this.trabajadorEnAsistencias.set(trabajador ?? null);
  }

  //Aqui habian 2 funciones, eran las que antes habia yo pensado que serían mandadas del hijo (del modulo de asistencias),
  /*Pero la verdad ví que es mejor dejar la logica en el hjo ya que si hay bastante calculo y procesamiento, sirve que calo a ver que tal sirve,
  aclaro aqui en caso de en un futuro no entender donde se hace el proceso de nomina y el proceso de asistencias, todo se lleva en el hijo, en el
  modal de asistencias-trabajador-rh */

  cerrarModalAsistencias(): void {
    this.trabajadorEnAsistencias.set(null);
  }
}