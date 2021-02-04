import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the VentaseparadaScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ventaseparada-scanner',
  templateUrl: 'ventaseparada-scanner.html',
})
export class VentaseparadaScannerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private barcodeScanner: BarcodeScanner,private toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    this.barcodeScanner.scan().then(barcodeData => {
      
      let toast = this.toastCtrl.create({message:'Barcode data'+ barcodeData,duration:1500});
      toast.present();
     }).catch(err => {
         
         let toast = this.toastCtrl.create({message:'Error al escanear: '+ err,closeButtonText:"Entendido",showCloseButton:true});
         toast.present();
      toast.present();
     });
  }

}
