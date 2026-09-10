import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Esta función la saqué fuera de la clase pq no depende de ninguna instancia del componente, o sea,
// solo necesita el FormGroup completo para comparar los dos campos de contraseña entre si
// (aunque realmente la pude meter dentro de la clase tambien, pero investigando vi que asi se hace
// mas comun cuando el validador no necesita "this")
function validadorContrasena(grupo: AbstractControl): ValidationErrors | null {
  const contrasena = grupo.get('contrasena')?.value;
  const confirmar = grupo.get('confirmarContrasena')?.value;
  return contrasena === confirmar ? null : { contrasenasNoCoinciden: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  cambiarVista = output<void>();

  // Aqui cada FormControl trae su propio arreglo de Validators, que son como "reglas" que checan
  // que lo que se escribio sea valido antes de dejar mandar el formulario
  // Validators.pattern es el que usé para las cosas mas especificas (regex) que Angular no trae
  // por defecto, tipo que el nombre solo acepte letras, o que la contraseña tenga mayuscula y numero
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
    // Aqui mando el validador que hice arriba, pero como segundo parametro del FormGroup, no de un
    // campo en especifico, pq necesita ver los dos campos de contraseña juntos, o sea, no puede ir
    // dentro de un solo FormControl
    { validators: validadorContrasena });

  registrarCliente(): void {
    // markAllAsTouched fuerza a que se muestren los errores de todos los campos aunque el usuario
    // no los haya tocado, si no, si le da submit vacio de volada, no se ve ningun error en pantalla
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }
    // aqui iría la logica de registro
  }
}