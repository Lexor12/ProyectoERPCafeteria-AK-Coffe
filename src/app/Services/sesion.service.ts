/*
Actualmente, cuando hacemos inicio de sesión los datos solo se guardan en esa ventana
para que durante todo la ejecución del sistema esten presentes los datos del login necesitamos
hacer una clase singletone que pues dicho objeto almacene los datos se la sesión, lo ideal
después de todo es que cuando se haga el inicio de sesión pues se use los tokens y este mecanismo
o se adapte o se reemplace
*/
import { Injectable,signal } from "@angular/core";
import { UsuarioSesion } from "../Models/usuarioSesion";

@Injectable({
    providedIn:'root'//Aqui es donde ocurre la magia, al poner este injectable con root, decimos que tendremos un singletone que se llamara cada vez que se requiera la clase desde la raiz del proyecto
    // o sea en terminos simples, decimos que cuando el server arranque, se creará 1 sola clase, al igual que con los demas services
    //para que asi, en cualquier parte del proyecto se pueda utilizar los datos bien
})
export class SesionService{
    // Este signal es el que va a leer el Navbar (y cualquier otro componente) para saber
    // quién es el usuario actual y qué rol tiene, arranca en null porque al abrir la página
    // nadie ha iniciado sesión todavía, pero en cuanto alguien inicia todos los demás
    // componentes reciben que hubo una modificación
    usuarioActual = signal<UsuarioSesion | null>(null);

    constructor() {
        /* Apenas se crea este service (o sea, apenas arranca la app), intento recuperar
        la sesión guardada, para que si el usuario refresca la página no se le cierre la sesión,
        entonces aqui tendria que ir el acceso a localStorage o algo para recibir el token antes guardado
        y poder procesarlo
        Posiblemente, deberia de haber una sentencia hacia backend que valide el token y el usuario, el
        token solo lleva ID, pero al mandarlo al backend este podria retornar los datos y validar dicho token
        */
    }
    // Esto se llama justo cuando el login responde bien, aqui guardamos tanto en el signal
    // para que los componentes reaccionen ante la modificación
    guardarSesion(usuario: UsuarioSesion): void {
        this.usuarioActual.set(usuario);
        //Aqui debemos de guardar el token para el usuario
    }

    // Esto se llama en el botón de "Cerrar sesión" del Navbar
    cerrarSesion(): void {
        this.usuarioActual.set(null);
        //Aqui debemos de borrar el token que habiamos creado en local storagw
    }

    cargarSesionGuardada(): void {
        /*Aqui ocurre la magia donde se carga lo de local storage */
    }
}