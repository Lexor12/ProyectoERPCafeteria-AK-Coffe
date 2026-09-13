import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { AsistenciaService } from '../../../../../Services/asistencia.service';
import { NominaService } from '../../../../../Services/nomina.service';
import { Asistencia } from '../../../../../Models/asistencia';


@Component({
  selector: 'app-asistencias-trabajador-rh',
  imports: [],
  templateUrl: './asistencias-trabajador-rh.component.html',
  styleUrl: './asistencias-trabajador-rh.component.css',
})
export class AsistenciasTrabajadorRhComponent implements OnInit{
  constructor(
    private asistenciaService: AsistenciaService,
    private nominaService: NominaService
  ) {}

  idTrabajador = input.required<string>();
  nombre = input.required<string>();
  apellido = input.required<string>();
  horaEntrada = input.required<string>();
  horaSalida = input.required<string>();

  // Mostramos esto de ejemplo para cualquier trabajador, pero en un futuro lo ideal es tener un
  // Model y que este arreglo use ese Model, y que los datos se obtengan de la BD
  asistencias = signal<Asistencia[]>([]);

  nuevaHoraEntrada = signal<string>('');
  nuevaHoraSalida = signal<string>('');//Estas se muestran sin valor en el momento en que se usa el modal para crear, pero en editar se usa el que ya se tenia antes
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  fechaAsistencia = signal<string>('');

  // Estos ya no son computed porque dependen de lo que regrese el backend
  // al calcular la nomina de un rango de fechas, no de los datos que ya tenemos cargados
  diasTrabajados = signal<number>(0);
  salarioDiario = signal<number>(0);
  totalAPagar = signal<number>(0);

  cerrar = output<void>();
  registrarAsistencia = output<{ idTrabajador: string; horaEntrada: string; horaSalida: string }>();
  descargarNomina = output<{ idTrabajador: string; fechaInicio: string; fechaFin: string }>();


  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias(): void {
    this.asistenciaService.obtenerAsistencias(this.idTrabajador()).subscribe({
      next: (asistenciasRecibidas) => {
        this.asistencias.set(asistenciasRecibidas);
      },
      error: (error) => {
        alert('No se pudieron cargar las asistencias');
      }
    });
  }

  actualizarFechaInicio(evento: Event): void {
    this.fechaInicio.set((evento.target as HTMLInputElement).value);
  }

  actualizarFechaFin(evento: Event): void {
    this.fechaFin.set((evento.target as HTMLInputElement).value);
  }

  actualizarAsistencia(evento: Event): void {
    this.fechaAsistencia.set((evento.target as HTMLInputElement).value);
  }

  actualizarNuevaHoraEntrada(evento: Event): void {
    this.nuevaHoraEntrada.set((evento.target as HTMLInputElement).value);
  }

  actualizarNuevaHoraSalida(evento: Event): void {
    this.nuevaHoraSalida.set((evento.target as HTMLInputElement).value);
  }

  clickAceptarAsistencia(): void {
    // Sin fecha o sin hora de entrada no tiene caso ni mandarlo al backend
    if (!this.fechaAsistencia() || !this.nuevaHoraEntrada()) {
      alert('Falta la fecha o la hora de entrada de la asistencia');
      return;
    }
    this.asistenciaService.registrarAsistencia(
      this.idTrabajador(),
      this.fechaAsistencia(),
      this.nuevaHoraEntrada(),
      this.nuevaHoraSalida()
    ).subscribe({
      next: (resultado) => {
        if (!resultado.registrada) {
          alert('Error al registrar asistencia')
          return;
        }
        this.cargarAsistencias();
        this.clickCancelarAsistencia();
      },
      error: (error) => {
        alert('No se pudo registrar la asistencia');
      }
    });
  }

  clickCancelarAsistencia(): void {
    this.nuevaHoraEntrada.set('');
    this.nuevaHoraSalida.set('');
    this.fechaAsistencia.set('');
  }

  clickDescargarNomina(): void {
    if (!this.fechaInicio() || !this.fechaFin()) {
      alert('Falta la fecha de inicio o la fecha de fin para calcular la nomina');
      return;
    }

    this.nominaService.calcularNomina(this.idTrabajador(), this.fechaInicio(), this.fechaFin()).subscribe({
      next: (nomina: any) => {
        // Por ahora solo mostramos los datos calculados en el resumen, la generacion
        // del comprobante en XML y su descarga real todavia falta hacerse
        if (nomina.mensaje) {
          console.log(nomina);
          return;
        }
        this.diasTrabajados.set(nomina.diasTrabajados);
        this.salarioDiario.set(nomina.salarioDiario);
        this.totalAPagar.set(nomina.totalAPagar);
      },
      error: (error) => {
        alert('No se pudo calcular la nomina');
      }
    });
  }

  clickCerrar(): void {
    this.cerrar.emit();
  }
}