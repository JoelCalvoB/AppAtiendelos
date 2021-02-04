import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TicketsProvider } from '../../providers/tickets/tickets';
@Component({
  selector: 'page-usuarios-activos',
  templateUrl: 'usuarios-activos.html',
})
export class UsuariosActivosPage {

  private arreglo = [];
  private id_sucursal;
  private id_ticket;
  private btn = true;
  private login:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private usuariosPrd: UsuariosProvider, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,private ticketsPrd:TicketsProvider,private toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
   if(!this.usuariosPrd.getFree()){
    
    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.id_ticket = this.navParams.get("id_ticket");
    this.login = this.navParams.get("login");

    this.login = (this.login == undefined)?false:this.login;
    
    this.id_sucursal = this.login == true ? this.navParams.get("id_sucursal"):this.id_sucursal;

    let mensaje = this.loadingCtrl.create({ content: "Recuperando los usuarios activos" });
    mensaje.present();
    this.usuariosPrd.getListaUsuariosSucursal(this.id_sucursal).subscribe(datos => {
      mensaje.dismiss();
      this.arreglo = datos;
    });
   }else{
     this.arreglo.push(this.usuariosPrd.getUsuario());
   }
  }

  public salir() {
    this.viewCtrl.dismiss();
  }



  public indice;
  public indiceAnterior;
  public dateAnterior;
  public contador;

  public marcar(indice) {
    this.btn = false;

    for (let item of this.arreglo) {
      item.clase = false;
      item.colorear = item.ocupada;
    }

    this.arreglo[indice].colorear = false;
    this.arreglo[indice].clase = true;


    this.indice = indice;


    if (this.indice == this.indiceAnterior) {
      var tiempoActual: any = new Date();
      let tiempoTranscurrido = tiempoActual - this.dateAnterior;
      if (tiempoTranscurrido > 250) {
        this.contador = 0;
        this.dateAnterior = new Date();
      }
      this.contador = this.contador + 1;
      if (this.contador == 2) {
        this.seleccionar();
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

  public seleccionar() {
     if(!this.usuariosPrd.getFree()){
      if(!this.login){
        let mensaje = this.alertCtrl.create({
          message: "¿Deseas cambiar la mesa de mesero?",
          buttons: [{
            text: "Si", handler: () => {
                this.ticketsPrd.cambiarMeseroTicket(this.id_ticket,this.arreglo[this.indice].id).subscribe(recibir =>{
                  let toast = this.toastCtrl.create({message:"Mesa cambiada de mesero",duration:1500});
                  toast.present();
                  this.viewCtrl.dismiss(1);
                });
            }
          },"No"]
        }
        );
    
        mensaje.present();
       }else{
  
  
        
        this.viewCtrl.dismiss(this.arreglo[this.indice].login);
  
       }
     }else{
      this.viewCtrl.dismiss(this.arreglo[this.indice].login);
     }
  }

  

}
