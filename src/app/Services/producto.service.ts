import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto } from "../Models/producto.model";

@Injectable({
    providedIn:'root'
})
export class ProductoService{
    private api = 'http://localhost:3200/api/productos'
    private dominioBackend = 'http://localhost:3200'
    constructor(private http:HttpClient){}
    
    // Trae el catálogo completo de productos activos, se usa tanto en la página de Catálogo
    // del cliente como en la de Inventario del admin, cada quien decide qué mostrar/ocultar
    obtenerProductos():Observable<Producto[]>{
        return this.http.get<Producto[]>(this.api)
    }

    // Trae un solo producto por su id, esto es para la ficha de detalle cuando el cliente
    // le da clic a un producto del catálogo para ver más info antes de agregarlo al carrito
    obtenerProductoPorId(idProducto: string):Observable<Producto>{
        return this.http.get<Producto>(`${this.api}/${idProducto}`)
    }

    // Se usa en Inventario cuando el admin edita nombre, descripción o precio de un producto
    // ya existente, el backend se encarga de actualizar la fecha de modificación solo
    editarProducto(idProducto: string, datos: { nombre: string; descripcion: string; precio: number }):Observable<any>{
        return this.http.put(`${this.api}/${idProducto}`, datos)
    }

    // Este es el botón de "Desactivar" en Inventario, no borra el producto de la BD,
    // solo lo marca como inactivo para que ya no aparezca en el catálogo del cliente
    desactivarProducto(idProducto: string):Observable<any>{
        return this.http.patch(`${this.api}/${idProducto}/desactivar`, {})
    }

    // Manda la imagen ya convertida a base64 (con el FileReader del componente),
    // el backend decide solo si reemplaza una imagen anterior o si es la primera vez que se sube
    subirImagenProducto(idProducto: string, imagenBase64: string):Observable<any>{
        return this.http.post(`${this.api}/${idProducto}/imagen`, { imagen: imagenBase64 })
    }

    // Este es para el botón de "Quitar imagen" sin querer reemplazarla por otra,
    // deja el producto sin imagen y el front debería mostrar el placeholder (RQNF23)
    eliminarImagenProducto(idProducto: string):Observable<any>{
        return this.http.delete(`${this.api}/${idProducto}/imagen`)
    }
    // Convierte una ruta relativa ("uploads/algo.png") en una URL completa que el navegador
    // sí puede resolver, apuntando al backend en vez de a Angular. Si no hay ruta (producto
    // sin imagen), regresa un placeholder para cumplir RQNF23
    obtenerUrlImagenCompleta(rutaRelativa: string | null | undefined): string {
        if (!rutaRelativa) {
            return 'images/sin-foto.png';
        }
        return `${this.dominioBackend}/${rutaRelativa}`;
    }
}