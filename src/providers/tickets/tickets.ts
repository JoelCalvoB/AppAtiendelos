import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';


/*
  Generated class for the TicketsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TicketsProvider {


  private data: Observable<any>;
  private data1: Observable<any>;

  private direccion = "";
  private direccion1 = "";

  constructor(public http: HttpClient) {
    this.direccion = direcciones.tickets;

  }

  public getTickets(id_sucursal): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/sucursal/" + id_sucursal;
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }


/*   public updateName(nombre , id): Observable <any>{

  } */

  public getTicketEspecifico(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    let id_sucursal = obj.id_sucursal;
    let id_mesa = obj.id_mesa;

    let filtrarDireccion = this.direccion + "/sucursal/" + id_sucursal + "/mesa/" + id_mesa;
    return this.http.get(filtrarDireccion);

  }

  public GetDesgloseCajaEspecial(id_carrito, fecha): Observable<any> {
    this.direccion = direcciones.tickets();
    let auxFecha = "";

    if (fecha == undefined) {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();
      let dia: string = "";
      let mes: string = "";

      if (dd < 10) {
        dia = "0" + dd;
      } else {
        dia = "" + dd;
      }

      if (mm < 10) {
        mes = '0' + mm;
      } else {
        mes = "" + mm;
      }

      auxFecha = yyyy + '-' + mes + '-' + dia;
    } else {
      auxFecha = fecha;
    }


    let filtrarDireccion = this.direccion + "/corteespecial" + "/sucursal/" + id_carrito + "/fecha/" + auxFecha;
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }




  public DeleteDesgloseCajaEspecial(id_carrito, fecha): Observable<any> {
    this.direccion = direcciones.tickets();
    let auxFecha = "";

    if (fecha == undefined) {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();
      let dia: string = "";
      let mes: string = "";

      if (dd < 10) {
        dia = "0" + dd;
      } else {
        dia = "" + dd;
      }

      if (mm < 10) {
        mes = '0' + mm;
      } else {
        mes = "" + mm;
      }

      auxFecha = yyyy + '-' + mes + '-' + dia;
    } else {
      auxFecha = fecha;
    }


    let filtrarDireccion = this.direccion + "/borrarespecial" + "/sucursal/" + id_carrito + "/fecha/" + auxFecha;
    return this.http.delete(filtrarDireccion);

  }


 



  public getTicketsDesgloseEspecial(id_carrito, fecha): Observable<any> {
    this.direccion = direcciones.tickets();
    let auxFecha = "";

    if (fecha == undefined) {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();
      let dia: string = "";
      let mes: string = "";

      if (dd < 10) {
        dia = "0" + dd;
      } else {
        dia = "" + dd;
      }

      if (mm < 10) {
        mes = '0' + mm;
      } else {
        mes = "" + mm;
      }

      auxFecha = yyyy + '-' + mes + '-' + dia;
    } else {
      auxFecha = fecha;
    }


    let filtrarDireccion = this.direccion +"/detaleespecial/sucursal/" + id_carrito + "/fecha/" + auxFecha;
    this.data = this.http.get(filtrarDireccion);

    return this.data;
  }

  public getTicketsCanceladosCobrados(id_carrito, fecha): Observable<any> {
    this.direccion = direcciones.tickets();
    let auxFecha = "";

    if (fecha == undefined) {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();
      let dia: string = "";
      let mes: string = "";

      if (dd < 10) {
        dia = "0" + dd;
      } else {
        dia = "" + dd;
      }

      if (mm < 10) {
        mes = '0' + mm;
      } else {
        mes = "" + mm;
      }

      auxFecha = yyyy + '-' + mes + '-' + dia;
    } else {
      auxFecha = fecha;
    }


    let filtrarDireccion = this.direccion + "/sucursal/" + id_carrito + "/fecha/" + auxFecha;
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }

  

  public insert(obj, unir): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    return this.http.post(this.direccion + "/" + unir, json, httpOptions);
  }

  public cancelar(id_Ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/cancelar/" + id_Ticket;
    this.data = this.http.delete(filtrarDireccion);
    return this.data;
  }


  public insertDetalle(obj): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let ruta = this.direccion + "/detalle";
    let json = JSON.stringify(obj);
    return this.http.post(ruta, json, httpOptions);
  }

  public insertDetalleLista(obj): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let ruta = this.direccion + "/detalle/lista";
    let json = JSON.stringify(obj);
    return this.http.post(ruta, json, httpOptions);
  }

  public getTicketsDetalle(id_ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/detalle/" + id_ticket;
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }
  public getTicketsDetalleAgrupado(id_ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/detalle/agrupado/" + id_ticket;
    
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }

  public getTicketsDetalleAgrupadoTicketFinal(id_ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/detalle/agrupado/ticketfinal/" + id_ticket;
    
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }

  public getTicketsDetalleAgrupadoTicketFinalEspecial(id_ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/detalle/agrupadoagrupadoespecial/ticketfinal/" + id_ticket;
    
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }

  public cobrarTicket(obj): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let ruta = this.direccion + "/cobrado";
    let json = JSON.stringify(obj);
    return this.http.put(ruta, json, httpOptions);
  }


  public notificaciones(id_sucursal, lugar): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/notificaciones/" + id_sucursal + "/lugar/" + lugar;
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }

  public detallecocineroactualizar(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let ruta = this.direccion + "/detallecocinero";
    let json = JSON.stringify(obj);

    this.data = this.http.put(ruta, json, httpOptions);
    return this.data;
  }

  public getNotificacion(): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/notificacion";
    this.data = this.http.get(filtrarDireccion);
    return this.data;
  }


  public actualizarDetalleTicket(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let filtrarDireccion = this.direccion + "/detalle";
    let json = JSON.stringify(obj);
    this.data = this.http.put(filtrarDireccion, json, httpOptions);
    return this.data;
  }


  public actualizaMesa(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let filtrarDireccion = this.direccion + "/actualizamesa";
    let json = JSON.stringify(obj);
    this.data = this.http.post(filtrarDireccion, json, httpOptions);
    return this.data;
  }


  public eliminarDetalleTicket(id): Observable<any> {
    this.direccion = direcciones.tickets();
    let filtrarDireccion = this.direccion + "/detalle/" + id;
    return this.http.delete(filtrarDireccion);
  }

  public cancelarDetalleTicket(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let filtrarDireccion = this.direccion + "/detalle";
    
    let json = JSON.stringify(obj);

    return this.http.put(filtrarDireccion, json, httpOptions);
  }

  public cancelarDetalleTicketLista(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let filtrarDireccion = this.direccion + "/detalle/lista";
    
    let json = JSON.stringify(obj);

    return this.http.put(filtrarDireccion, json, httpOptions);
  }


  public getActivosUsuarioEspecificoPorTicket(id_sucursal, id_usuario): Observable<any> {
    this.direccion = direcciones.tickets();
    return this.http.get(this.direccion + "/mesas/" + id_sucursal + "/mesero/" + id_usuario);
  }

  public cambiarMeseroTicket(id_ticket, id_mesero): Observable<any> {
    this.direccion = direcciones.tickets();
    return this.http.put(this.direccion + "/cambiarmesa/" + id_ticket + "/" + id_mesero, "");
  }
  public CorteCaja(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    let ruta = this.direccion + "/cortecierreespecial";
    let json = JSON.stringify(obj);
    
    return this.http.post(ruta, json, httpOptions);
  }

  public cambiarMesa(obj, unir): any {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.put(this.direccion + "/cambiarmesa/" + unir, json, httpOptions);
  }

  public aplicandoDescuento(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    return this.http.post(this.direccion + "/descuento", json, httpOptions);

  }

  public getPassword(): Observable<any> {
    this.direccion1 = direcciones.key();
    let filtrarDireccion = this.direccion1 + "/key";
    this.data = this.http.get(filtrarDireccion);

    return this.data;
  }


  public ActualizaKey(): Observable<any> {
    this.direccion1 = direcciones.key();
    let filtrarDireccion = this.direccion1 + "/keyactualiza";
    
    this.data = this.http.put(filtrarDireccion, {});

    return this.data;

  }

  public separarMesas(id_ticket, cantidad): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let url = this.direccion + `/mesaseparada/${id_ticket}/partir/${cantidad}`;
    return this.http.post(url, {}, httpOptions);
  }


  public establecerKey(): Observable<any> {
    this.direccion1 = direcciones.key();
    let filtrarDireccion = this.direccion1;


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(filtrarDireccion, {}, httpOptions);
  }


  public insertAlias(obj): Observable<any> {
    this.direccion = direcciones.tickets();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

 
    return this.http.post(this.direccion + "/alias", json, httpOptions);
  }


  public getCantidadMesas(id_sucursal, id_mesero): Observable<any> {
    this.direccion = direcciones.tickets();
    return this.http.get(this.direccion + "/mesas/cantidad/" + id_sucursal + "/mesero/" + id_mesero);
  }

  public getTicketActivo(id_ticket): Observable<any> {
    this.direccion = direcciones.tickets();
    return this.http.get(this.direccion + "/ticket/activo/" + id_ticket);
  }


  public cambiarProductoMesa(obj): Observable<any> {
    this.direccion = direcciones.tickets();
    let enviar = `${this.direccion}/productos/cambiarMesa/${obj.id_ticketnuevo}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    return this.http.post(enviar, json, httpOptions);
  }


  public unircuentas(id_ticket, lista): Observable<any> {
    this.direccion = direcciones.tickets();
    let enviar = `${this.direccion}/${id_ticket}/unircuentas`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(lista);
    return this.http.post(enviar, json, httpOptions);
  }

  public separarItems(id_ticket, lista) {
    this.direccion = direcciones.tickets();
    let enviar = `${this.direccion}/${id_ticket}/separaritems`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(lista);
    return this.http.post(enviar, json, httpOptions);
  }

}
