import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';



@Component({
  selector: 'page-cuenta-detalle-config-more',
  templateUrl: 'cuenta-detalle-config-more.html',
})
export class CuentaDetalleConfigMorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewctrl:ViewController) {
  }

  ionViewDidLoad() {
    
  }

  public cerrar(numero){
    this.viewctrl.dismiss(numero);
  }

  public salir(){
    this.viewctrl.dismiss();
  }

}
