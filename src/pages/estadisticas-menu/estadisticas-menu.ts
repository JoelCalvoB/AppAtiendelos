import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProductoMasvendidoPage} from '../producto-masvendido/producto-masvendido';
import {EstadisticaMeseroPage} from '../estadistica-mesero/estadistica-mesero';
import {EstadisticaVentaxmesPage} from '../estadistica-ventaxmes/estadistica-ventaxmes';
/**
 * Generated class for the EstadisticasMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-estadisticas-menu',
  templateUrl: 'estadisticas-menu.html',
})
export class EstadisticasMenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  public abrir(obj) {
    
    switch (obj) {
        case 'masVendido':
        this.navCtrl.push(ProductoMasvendidoPage);
        break;
        case 'PorMesero':
        this.navCtrl.push(EstadisticaMeseroPage);
        break;
        case'PorMes':
        this.navCtrl.push(EstadisticaVentaxmesPage);
      default:
        break;
    }


}
}
