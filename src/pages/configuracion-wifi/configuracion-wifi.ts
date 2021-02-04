import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the ConfiguracionWifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-configuracion-wifi',
  templateUrl: 'configuracion-wifi.html',
})
export class ConfiguracionWifiPage {

  public objWifi;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,private toastCtrl:ToastController) {
    this.objWifi = this.navParams.get("objWifi");
  }

  ionViewDidLoad() {
    this.objWifi = this.navParams.get("objWifi");
  }


  public dispositivos(obj) {

    let alerta;
    switch (obj) {
      case "cajero":
        alerta = this.alertCtrl.create({
          subTitle: "Impresora cajero", message: "Direccion ip cajero", inputs: [{ placeholder: "Ip cajero", name: "cajero", type: "number" }],
          buttons: [{
            text: "Aceptar", handler: datos => {
              let ip = datos.cajero;


              this.objWifi.ipcajero = ip;

            }
          }]
        });


        alerta.present();
        break;
      case "cocina":
        alerta = this.alertCtrl.create({
          subTitle: "Impresora cocina caliente", message: "Direccion ip cocina", inputs: [{ placeholder: "Ip cocina", name: "cajero", type: "number" }],
          buttons: [{
            text: "Aceptar", handler: datos => {
              let ip = datos.cajero;
              this.objWifi.ipCocinaCaliente = ip;
            }
          }]
        });


        alerta.present();
        break;
      case "cocinafria":
        alerta = this.alertCtrl.create({
          subTitle: "Impresora cocina fria", message: "Direccion ip cocina fria", inputs: [{ placeholder: "Ip cocina fria", name: "cajero", type: "number" }],
          buttons: [{
            text: "Aceptar", handler: datos => {
              let ip = datos.cajero;
              this.objWifi.ipCocinaFria = ip;
            }
          }]
        });


        alerta.present();
        break;
      case "barra":
      alerta = this.alertCtrl.create({
        subTitle: "Impresora barra", message: "Direccion ip barra", inputs: [{ placeholder: "Ip barra", name: "cajero", type: "number" }],
        buttons: [{
          text: "Aceptar", handler: datos => {
            let ip = datos.cajero;
            this.objWifi.ipBarra = ip;
          }
        }]
      });


      alerta.present();
        break;
      default:
        break;

    }

  }


  public imprimir() {


  }


  public guardarCambios(caja,cocina,cocinafria,barra){



     this.objWifi.ipcajero = caja;
     this.objWifi.ipCocinaCaliente = cocina;
     this.objWifi.ipCocinaFria = cocinafria;
     this.objWifi.ipBarra = barra;


     
     let alerta = this.toastCtrl.create({message:"Configuracion Wifi establecida, favor de guardar cambios",duration:1500});
     alerta.present();
     this.navCtrl.pop();
  }

}
