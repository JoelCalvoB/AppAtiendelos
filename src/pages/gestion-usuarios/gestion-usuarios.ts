import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { UsuariosPage } from '../usuarios/usuarios';
import { RolesPage } from '../roles/roles';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TabsPage } from '../tabs/tabs';


/**
 * Generated class for the GestionUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-gestion-usuarios',
  templateUrl: 'gestion-usuarios.html',
})
export class GestionUsuariosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private globales: GlobalesProvider,private usuariosPrd:UsuariosProvider,
    private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    if(this.usuariosPrd.getFree()){
      let alerta = this.alertCtrl.create({subTitle:"No se puede gestionar usuarios en modo FREE, favor de contratar todos los servicios",buttons:["Entendido"]});
      alerta.present();
      this.navCtrl.setRoot(TabsPage);
    }
  }


  public salir() {
    this.globales.cerrarAplicacion();
  }

  public abrirVentana(ventana) {
    switch (ventana) {
      case "usuarios":
        this.navCtrl.push(UsuariosPage);
        break;
      case "roles":
        this.navCtrl.push(RolesPage);
        break;
      default:
        break;
    }
  }

}
