import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { BluetoothDispositivosPage } from '../bluetooth-dispositivos/bluetooth-dispositivos';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { GlobalesProvider } from '../../providers/globales/globales';


/**
 * Generated class for the BluetoothPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
})
export class BluetoothPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private toasCtrl:ToastController,
  private bt:BluetoothSerial,private globales:GlobalesProvider) {
  }

  ionViewDidLoad() {
  }

  public dispositivos(tipo){
      this.navCtrl.push(BluetoothDispositivosPage,{tipo:tipo});
  }

  public imprimir(){
      let toas = this.toasCtrl.create({message:"Impresión prueba mandada a impresora",duration:1500});
      toas.present();
      let mensajeCajero = "prueba de impresora en caja\n\n\n\n\n\n";

      let mensajeCocina = "prueba de impresora en cocina\n\n\n\n\n\n";

      let mensajeBarra = "prueba de impresora en barra\n\n\n\n\n\n";

      this.globales.conectarCajero(mensajeCajero).then(aux1 =>{
        this.globales.conectarCocina(mensajeCocina).then(aux2=>{
          this.globales.conectarBarra(mensajeBarra).then(aux3=>{
            
          });
        });
      });
      
  }

}
