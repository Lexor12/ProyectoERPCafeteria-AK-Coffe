import { Component, signal, output,inject } from '@angular/core';
import { AuthService } from '../../../../../Services/auth.service';
import { Router } from '@angular/router';
import { solicitudLogin } from '../../../../../Models/solicitudLogin';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  cambiarVista = output<void>();
  // Uso FormGroup en vez de simplemente sacar los valores con [(ngModel)] pq la maestra dijo que
  // evitemos meter cosas que jalen NgModule (y ngModel viene de FormsModule, que aunque no es lo mismo
  // que NgModule, mejor ni me arriesgo), entonces uso Reactive Forms, que es lo mismo pero de otra forma
  // FormGroup es como el "grupo" completo del formulario, y cada FormControl es un campo individual
  // dentro de ese grupo, con sus propias reglas (Validators) de que es lo que se acepta
  constructor(private authService: AuthService, private router: Router) {}
  
  //Utilizamos signals para guardar cualquier intento de input por parte del usuario
  //de esta forma guardamos el correo y la contraseña, si lo borra o corrige nosotros registramos esto
  correo=signal<string>('')
  contrasena=signal<string>('')
  //Mediante estas funciones registramos aquellos cambios de valores de los signals
  actualizarCorreo(event:Event){
    this.correo.set((event.target as HTMLInputElement).value)
  }
  actualizarContrasena(event:Event){
    this.contrasena.set((event.target as HTMLInputElement).value)
  }

  mensajeError = signal<string>('');
  mensajeExito = signal<string>('');

  iniciarSesion(event:Event): void {
    event.preventDefault();
    this.mensajeError.set('');
    this.mensajeExito.set('');

    const solicitud : solicitudLogin= {
      correo:this.correo(),
      password: this.contrasena()
    }

    this.authService.login(solicitud).subscribe({
      next: (respuesta) => {
        this.authService.guardarSesion(respuesta);
        if (respuesta.rol === 'administrador') {
          this.router.navigate(['/admin/inventario'])
        } else {
          this.router.navigate(['/tienda'])
        }
      },
      error: (error) => {
        this.mensajeError.set(error.error?.mensaje ?? 'Ocurrió un error, intenta de nuevo');
      }
    });
  }
}
