import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from '../../assets/direcciones';



/*
  Generated class for the ConfiguracionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfiguracionProvider {

  constructor(public http: HttpClient) {

  }

  public getConfiguracion(idsucursal): Observable<any> {
    let direccion = `${direcciones.configuracion()}?idsucursal=${idsucursal}`;
    return this.http.get(direccion);
  }

  public setConfiguracion(obj): Observable<any> {
    let direccion = `${direcciones.configuracion()}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    return this.http.post(direccion, json, httpOptions);

  }

}
