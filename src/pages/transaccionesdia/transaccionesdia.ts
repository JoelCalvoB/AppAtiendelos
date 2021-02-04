import { Component } from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TicketsPage } from '../tickets/tickets';
import { GlobalesProvider } from '../../providers/globales/globales';

/**
 * Generated class for the TransaccionesdiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-transaccionesdia',
  templateUrl: 'transaccionesdia.html',
})
export class TransaccionesdiaPage {
  private id_sucursal;
  public arreglo:any = [];
  public boolCancelar;
  public boolCobrar;
  public menutogle;
  public indice;  
  public contador;
  public deslizar;
  public indiceAnterior;
  public dateAnterior;
  constructor(public navCtrl: NavController, private ticketsPrd:TicketsProvider,
  private usuariosPrd:UsuariosProvider,private globales:GlobalesProvider) {

    if(!this.usuariosPrd.getFree()){
      this.id_sucursal = usuariosPrd.getSucursal();
      this.ticketsPrd.getTicketsCanceladosCobrados(this.id_sucursal,undefined).subscribe(datos => {
        this.arreglo = datos;
        
      });
    }else{
           
    }
  }


  ionViewDidEnter(){

    if(!this.usuariosPrd.getFree()){
      this.ticketsPrd.getTicketsCanceladosCobrados(this.id_sucursal,undefined).subscribe(datos => {
        this.arreglo = datos;
      });

    }else{
       

    }
  }
  public actualizandoTransacciones(refresher): any {

    this.ticketsPrd.getTicketsCanceladosCobrados(this.id_sucursal,undefined).subscribe(datos => {
      this.arreglo = datos;
      refresher.complete();
    });
  }



  public reimprimir(obj):any{

    this.navCtrl.push(TicketsPage,{id_ticket:obj.id_ticket});
  }


  public salir(){
    this.globales.cerrarAplicacion();
  }


  public marcar(indice) {

    for (let item of this.arreglo) {
      item.clase = false;
      item.colorear = item.ocupada;
    }

    this.arreglo[indice].colorear = false;
    this.arreglo[indice].clase = true;

    if (this.arreglo[indice].ocupada == true) {
      this.boolCancelar = true;
      this.boolCobrar = true;
    } else {
      this.boolCancelar = false;
      this.boolCobrar = false;
    }

    this.menutogle = true;
    this.indice = indice;
    this.deslizar = true;


    if (this.indice == this.indiceAnterior) {
      var tiempoActual: any = new Date();
      let tiempoTranscurrido = tiempoActual - this.dateAnterior;
      if (tiempoTranscurrido > 250) {
        this.contador = 0;
        this.dateAnterior = new Date();
      }
      this.contador = this.contador + 1;
      if (this.contador == 2) {
        this.traerCuenta(this.arreglo[indice]);
        this.dateAnterior = new Date();
      } else if (this.contador > 2) {
        this.contador = 1;
      }

    } else {
      this.dateAnterior = new Date();
      this.indiceAnterior = this.indice;
      this.contador = 1;
    }



  }

  public traerCuenta(obj){
      this.reimprimir(obj);

  }

}
