import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  mostrarContraseña:boolean=false;
  cambiarVista=output<void>();

  formularioLogin=new FormGroup({
    correo:new FormControl('',[Validators.required,Validators.email]),
    contrasena:new FormControl('',[Validators.required])
  })
  iniciarSesion(): void{

  }
}
