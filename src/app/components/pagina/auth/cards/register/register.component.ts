import { Component, output,signal } from '@angular/core';
import { AuthService } from '../../../../../Services/auth.service';
import { solicitudRegistro } from '../../../../../Models/solicitudRegistro';
import { RouterLink,RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  cambiarVista = output<void>();
  constructor(private authService: AuthService) {}

  // Datos que escribe el usuario
  nombre = signal('');
  apellido = signal('');
  correo = signal('');
  telefono = signal('');
  contrasena = signal('');
  confirmarContrasena = signal('');
  confirmarTerminos = signal<boolean>(false);
  //Actualización de los valores que escribe el usuario
  actualizarNombre(event:Event){
    this.nombre.set((event.target as HTMLInputElement).value)
  }
  actualizarApellido(event:Event){
    this.apellido.set((event.target as HTMLInputElement).value)
  }
  actualizarCorreo(event:Event){
    this.correo.set((event.target as HTMLInputElement).value)
  }
  actualizarTelefono(event:Event){
    this.telefono.set((event.target as HTMLInputElement).value)
  }
  actualizarContrasena(event:Event){
    this.contrasena.set((event.target as HTMLInputElement).value)
  }
  actualizarContrasenaValidacion(event:Event){
    this.confirmarContrasena.set((event.target as HTMLInputElement).value)
  }
  //Validamos si el usuario hizo check a los terminos y condiciones
  actualizarTerminos(event: Event) {
    this.confirmarTerminos.set((event.target as HTMLInputElement).checked)
  }
  // Guardo aqui el mensaje que venga del backend, ya sea de error (correo duplicado)
  // o de éxito, para mostrarlo en el HTML
  mensajeError = signal<string>('');
  mensajeExito = signal<string>('');

  registrarCliente(event:Event): void {
    event.preventDefault()
    this.mensajeError.set('');
    this.mensajeExito.set('');

    // Validaciones manuales
    if (!this.nombre().trim() ||!this.apellido().trim() ||!this.correo().trim() ||!this.telefono().trim() ||!this.contrasena() ||!this.confirmarContrasena()) {
      this.mensajeError.set('Todos los campos son obligatorios');
      return;
    }
    //La mejor forma de validar un texto es con regex, para usar regex usamos / y la expresión regular y después /, y usamos el metodo .test(y aqui el string)
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(this.nombre().trim())) {
      this.mensajeError.set('El nombre no es válido');
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(this.apellido().trim())) {
      this.mensajeError.set('El apellido no es válido');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo().trim())) {
      this.mensajeError.set('Ingresa un correo válido');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.telefono())) {
      this.mensajeError.set('El teléfono debe tener 10 dígitos');
      return;
    }

    if (this.contrasena().length < 8 ||this.contrasena().length > 64 ||!/(?=.*[A-Z])(?=.*[0-9])/.test(this.contrasena())) {
      this.mensajeError.set('La contraseña necesita 8 caracteres, una mayúscula y un número');
      return;
    }

    if (this.contrasena() !== this.confirmarContrasena()) {
      this.mensajeError.set('Las contraseñas no coinciden');
      return;
    }

    // Datos que se envían al backend
    const datosNuevoUsuario: solicitudRegistro = {
      nombre: this.nombre().trim(),
      apellido: this.apellido().trim(),
      correo: this.correo().trim(),
      telefono: this.telefono(),
      password: this.contrasena(),
      confirmacionTerminosYCondiciones: this.confirmarTerminos()
    };

    this.authService.registro(datosNuevoUsuario).subscribe({
      next: (respuesta) => {
        this.mensajeExito.set("Cuenta creada con exito!")
        setTimeout(() => {
          this.cambiarVista.emit();
        }, 1500);
      },
      error: (error) => {
        this.mensajeError.set(error.error?.mensaje ?? 'Ocurrió un error, intenta de nuevo');
      }
    });
  }
}