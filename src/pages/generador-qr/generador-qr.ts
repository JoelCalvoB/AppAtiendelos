import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {QRScanner,QRScannerStatus} from '@ionic-native/qr-scanner/ngx'

/**
 * Generated class for the GeneradorQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-generador-qr',
  templateUrl: 'generador-qr.html',
})
export class GeneradorQrPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner) {
  }

  ionViewDidLoad() {
    
  }


  public prueba ()
  {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        // el permiso fue otorgado
        // iniciar el escaneo
        let scanSub = this.qrScanner.scan().subscribe((texto: string) => {
          
          
          this.qrScanner.hide(); // esconder el preview de la camara
          scanSub.unsubscribe(); // terminar el escaneo
        }); 
  
      } else if (status.denied) {
        // el permiso no fue otorgado de forma permanente
        // debes usar el metodo QRScanner.openSettings() para enviar el usuario a la pagina de configuracion
        // desde ahí podrán otorgar el permiso de nuevo
      } else {
        // el permiso no fue otorgado de forma temporal. Puedes pedir permiso de en cualquier otro momento
      }
    }) .catch((e: any) => {});
  }

}
