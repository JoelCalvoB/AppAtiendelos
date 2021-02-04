import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ReportesVentaPage } from '../reportes-venta/reportes-venta';
import { ReporteInventarioPage } from '../reporte-inventario/reporte-inventario';
import {EstadisticasMenuPage} from '../estadisticas-menu/estadisticas-menu';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the ReportesMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reportes-menu',
  templateUrl: 'reportes-menu.html',
})
export class ReportesMenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private usuariosPrd:UsuariosProvider,private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    if(this.usuariosPrd.getFree()){
      let alerta = this.alertCtrl.create({subTitle:"No se puede ver reportes en modo FREE, favor de contratar todos los servicios",buttons:["Entendido"]});
      alerta.present();
      this.navCtrl.setRoot(TabsPage);
    }
  }

  public salir() {

  }

  public abrir(obj) {
    
    switch (obj) {
      case 'ventas':
        this.navCtrl.push(ReportesVentaPage);
        break;
      case 'productos':
        break;
      case 'inventarios':
        this.navCtrl.push(ReporteInventarioPage);
        break;
        case 'graficas':
        this.navCtrl.push(EstadisticasMenuPage);
        break;
      default:
        break;
    }

  }

}
