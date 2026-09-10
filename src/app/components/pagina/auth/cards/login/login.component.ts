import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
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
  formularioLogin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
  });

  iniciarSesion(): void {

  }
}
