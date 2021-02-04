import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
/*
  Generated class for the ProductosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductosProvider {

  private data:Observable<any>;
  private direccion = "";

  constructor(public http: HttpClient) {
  }

  public getProductos():Observable<any>{
    this.direccion = direcciones.productos();   
    this.data = this.http.get(this.direccion);
    return this.data;
   }
   public getProductosCategoria(id):Observable<any>{   
    this.direccion = direcciones.productos();
    this.data = this.http.get(this.direccion+"/categoria/"+id);
    return this.data;
   }

   public getProductosCategoriaSub(id,subcategoria):Observable<any>{   
    this.direccion = direcciones.productos();
    this.data = this.http.get(this.direccion+"/categoria/"+id+"/subcategoria/"+subcategoria);
    return this.data;
   }

    public getCategoriaConListaproductos():Observable<any>{
      this.direccion = direcciones.productos();
        return this.http.get(this.direccion+"/lista/categorias");
    }

   public eliminar(id):Observable<any>{
    this.direccion = direcciones.productos();
    this.data = this.http.delete(this.direccion+"/"+id);
    return this.data;
   }
 
   public insertar(obj):Observable<any>{
    this.direccion = direcciones.productos();
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.post(this.direccion,json,httpOptions);
   }
 
   public modificar(obj):Observable<any>{
    this.direccion = direcciones.productos();
     
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.put(this.direccion,json,httpOptions);
   }

   public insertarinsumos(obj):Observable<any>{
    this.direccion = direcciones.productos();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion+"/insumos",json,httpOptions);

   }

   public obtenerinsumos(id,id_sucursal):Observable<any>{
    this.direccion = direcciones.productos();
      let uri = `${this.direccion}/${id_sucursal}/insumos/${id}`;
      return this.http.get(uri);
   }

}
