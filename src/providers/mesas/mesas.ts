import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';

/*
  Generated class for the MesasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MesasProvider {
  private direccion = "";
  constructor(public http: HttpClient) {
  }

  public gets(id_sucursal): Observable<any> {
    this.direccion = direcciones.mesas();
    return this.http.get(this.direccion+"/"+id_sucursal);
  }
  public getActivos(id_sucursal,activo): Observable<any> {
    this.direccion = direcciones.mesas();
    return this.http.get(this.direccion+"/"+id_sucursal+"/activos/"+activo);
  }

  public getActivosResumidos(id_sucursal,off): Observable<any> {
    this.direccion = direcciones.mesas();
    return this.http.get(this.direccion+"/"+id_sucursal+"/activos/resumido/"+off);
  }

  public getActivosUsuarioEspecifico(id_sucursal,activo,usuario): Observable<any> {
    this.direccion = direcciones.mesas();
    
    return this.http.get(this.direccion+"/"+id_sucursal+"/activos/"+activo+"/usuario/"+usuario);
  }

 

  public eliminar(id,id_sucursal): Observable<any> {
    this.direccion = direcciones.mesas();
    return this.http.delete(this.direccion + "/" + id+"/"+id_sucursal);
  }

  public insertar(obj): Observable<any> {
    this.direccion = direcciones.mesas();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    return this.http.post(this.direccion, json, httpOptions);
  }

  public modificar(obj): Observable<any> {
    this.direccion = direcciones.mesas();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    return this.http.put(this.direccion, json, httpOptions);
  }


}
