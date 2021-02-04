import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { InventariosPage } from '../inventarios/inventarios';
import { AjusteInventarioPage } from '../ajuste-inventario/ajuste-inventario';
import { ConfiguracionCategoriasPage } from '../configuracion-categorias/configuracion-categorias';
import {ProveedorAdministradorPage} from '../proveedor-administrador/proveedor-administrador';
import {AdminBodegasPage} from '../admin-bodegas/admin-bodegas';
import {BodegasPage} from '../bodegas/bodegas';
import {MedidasInventarioPage} from '../medidas-inventario/medidas-inventario';
import {OrdenesConsultaPage} from '../ordenes-consulta/ordenes-consulta';
import {CorteInventarioPage} from '../corte-inventario/corte-inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the InventariosInicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-inventarios-inicio',
  templateUrl: 'inventarios-inicio.html',
})
export class InventariosInicioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private globales:GlobalesProvider,private usuariosPrd:UsuariosProvider,private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    if(this.usuariosPrd.getFree()){
      let alerta = this.alertCtrl.create({subTitle:"No se puede gestionar inventarios en modo FREE, favor de contratar todos los servicios",buttons:["Entendido"]});
      alerta.present();
      this.navCtrl.setRoot(TabsPage);
    }
  }

  

  public salir(){
    this.globales.cerrarAplicacion();
  }


  public abrirVentana(cadena){
  

    switch(cadena){
        case "inventario":
        this.navCtrl.push(InventariosPage);
        break;
        case "enlace":
        this.navCtrl.push(ConfiguracionCategoriasPage);
        break;
        case "bodega":
        this.navCtrl.push(BodegasPage);
        break;
        case "EntradasSalidas":
        this.navCtrl.push(AjusteInventarioPage)
        break;
        case "proveedor":
        this.navCtrl.push(ProveedorAdministradorPage)
        break;
        case "ordenes":
        this.navCtrl.push(OrdenesConsultaPage)
        break;
        case "Unidades":
        this.navCtrl.push(MedidasInventarioPage)  
        break;
        case "Corte":
          this.navCtrl.push(CorteInventarioPage)
          break;
    }
  }
}
