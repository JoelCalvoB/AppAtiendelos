import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
/*
  Generated class for the SucursalesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SucursalesProvider {
  

  constructor(public http: HttpClient) {
    
  }


  public gets():Observable<any>{   
    let direccion = direcciones.sucursales();
    return this.http.get(direccion);
   }
   public getEspecifico(id):Observable<any>{   
    let direccion = direcciones.sucursales();
    return this.http.get(direccion+"/"+id);
   }

   public eliminar(id):Observable<any>{
    let direccion = direcciones.sucursales();
    return this.http.delete(direccion+"/"+id);
   }
 
   public insertar(obj):Observable<any>{
    let direccion = direcciones.sucursales();
     
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.post(direccion,json,httpOptions);
   }
 
   public modificar(obj):Observable<any>{
    let direccion = direcciones.sucursales(); 

     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.put(direccion,json,httpOptions);
   }

}
