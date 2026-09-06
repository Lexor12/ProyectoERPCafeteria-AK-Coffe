import { Component, output } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators,AbstractControl,ValidationErrors } from '@angular/forms';
import { validate } from '@angular/forms/signals';

function validadorContrasena(grupo: AbstractControl): ValidationErrors | null {
  const contrasena =grupo.get('contrasena')?.value;
  const confirmar=grupo.get('confirmarContrasena')?.value;
  return contrasena === confirmar ? null : { contrasenasNoCoinciden: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  cambiarVista=output<void>();

  formularioRegistro = new FormGroup(
    {
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), 
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/), 
      ]),
      correo: new FormControl('', [
        Validators.required,
        Validators.email, 
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/), 
      ]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/), 
      ]),
      confirmarContrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/),
      ]),
    }, 
    { validators: validadorContrasena });

    registrarCliente(): void{
      if(this.formularioRegistro.invalid){
        this.formularioRegistro.markAllAsTouched();
        return;
      }
      //logica de registro
    }
}
