import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { direcciones } from '../../assets/direcciones';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-control-movimiento-finalizado',
  templateUrl: 'control-movimiento-finalizado.html',
})
export class ControlMovimientoFinalizadoPage {

  private obj = {id_corte:16};
  constructor(public navCtrl: NavController, public navParams: NavParams,private iab:InAppBrowser) {
       this.obj = navParams.get("obj");
  }

  ionViewDidLoad() {
  }



  public realizado(){
    this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/inventario/corte/${this.obj.id_corte}`,"_system");
    this.navCtrl.pop();
  }
  public cerrar(){
    this.navCtrl.pop();
  }
}
