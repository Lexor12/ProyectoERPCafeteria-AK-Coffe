import { Component, signal, output,inject } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { AuthService } from '../../../../../Services/auth.service';
import { Router } from '@angular/router';
import { SesionService } from '../../../../../Services/sesion.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  cambiarVista = output<void>();
  sesionService=inject(SesionService)
  // Uso FormGroup en vez de simplemente sacar los valores con [(ngModel)] pq la maestra dijo que
  // evitemos meter cosas que jalen NgModule (y ngModel viene de FormsModule, que aunque no es lo mismo
  // que NgModule, mejor ni me arriesgo), entonces uso Reactive Forms, que es lo mismo pero de otra forma
  // FormGroup es como el "grupo" completo del formulario, y cada FormControl es un campo individual
  // dentro de ese grupo, con sus propias reglas (Validators) de que es lo que se acepta
  constructor(private authService: AuthService, private router: Router) {}


  mensajeError = signal<string>('');


  formularioLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
  });

  iniciarSesion(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }
    this.mensajeError.set('');

    const correo = this.formularioLogin.value.correo!;
    const contrasena = this.formularioLogin.value.contrasena!;

    this.authService.login(correo, contrasena).subscribe({
      next: (respuesta) => {
        if (respuesta.autenticado) {
          this.sesionService.guardarSesion({
            idUsuario: respuesta.idUsuario!,
            nombre: respuesta.nombre!,
            apellido: respuesta.apellido!,
            rol: respuesta.rol!,
          });
          if (respuesta.rol === 'administrador') {
            this.router.navigate(['/admin/inventario'])
          } else {
            this.router.navigate(['/tienda'])
          }
        } else {
          this.mensajeError.set('Correo o contraseña incorrectos');
        }
      },
      error: (error) => {
        alert('Error al iniciar sesión');
        this.mensajeError.set('Ocurrió un error, intenta de nuevo');
      }
    });
  }
}
