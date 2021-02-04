import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
/*
  Generated class for the CortecajaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CortecajaProvider {

  private direccion = "";
  private obj;


  constructor(public http: HttpClient) {
  }

  public totalCortecaja(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let fecha = obj.fecha;
    let url = this.direccion + `/sucursal/${idsucursal}/fechas?fecha=${fecha}`;
    return this.http.get(url);

  }

  public totalCortecajaSincorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let url = this.direccion + `/sucursal/${idsucursal}`;
    return this.http.get(url);

  }
  public totalCortecajaConcorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let id_corte = obj.id;
    let url = this.direccion + `/sucursal/${idsucursal}/cortecaja/${id_corte}`;
    return this.http.get(url);

  }

  public getGastos(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let fecha = obj.fecha;
    let url = this.direccion + `/sucursal/${idsucursal}/gastos/fechas?fecha=${fecha}`;
    return this.http.get(url);
  }
  public getGastosSinCorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let fecha = obj.fecha;
    let url = this.direccion + `/sucursal/${idsucursal}/gastos`;
    return this.http.get(url);
  }
  public getEntradasSinCorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let fecha = obj.fecha;
    let url = this.direccion + `/sucursal/${idsucursal}/entradas`;
    return this.http.get(url);
  }
  public getGastosConCorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let id_corte = obj.id;
    let url = this.direccion + `/sucursal/${idsucursal}/gastos/cortecaja/${id_corte}`;
    return this.http.get(url);
  }

  public getEntradasConCorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let idsucursal = obj.idsucursal;
    let id_corte = obj.id;
    let url = this.direccion + `/sucursal/${idsucursal}/entradas/cortecaja/${id_corte}`;
    return this.http.get(url);
  }

  public addGastos(lista): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let url = this.direccion + "/gastos";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    
    let json = JSON.stringify(lista);
    return this.http.post(url, json, httpOptions);
  }

  public addEntradas(lista): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let url = this.direccion + "/entradas";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    
    let json = JSON.stringify(lista);
    return this.http.post(url, json, httpOptions);
  }


  public insertarCorte(obj): Observable<any> {
    this.direccion = direcciones.cortecaja();
    let url = this.direccion + "/cortecaja";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(url, json, httpOptions);
  }


  public obtenerCortesCaja(id_sucursal, offset): Observable<any> {
    this.direccion = direcciones.cortecaja();

    let dire = this.direccion + `/sucursal/${id_sucursal}/offset/${offset}`;
    return this.http.get(dire);
  }


  public realizarcorte(obj){
    this.direccion = direcciones.cortecaja();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(this.direccion+"/realizar_corte", json, httpOptions);
  }

}
