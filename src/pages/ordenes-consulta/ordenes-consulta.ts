import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController ,FabContainer, ViewController, Refresher} from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { InventarioProvider } from '../../providers/inventario/inventario';
import {OrdenCompraPage} from '../orden-compra/orden-compra';
import {OrdenDetallePage} from '../orden-detalle/orden-detalle';

/**
 * Generated class for the OrdenesConsultaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ordenes-consulta',
  templateUrl: 'ordenes-consulta.html',
})
export class OrdenesConsultaPage {
  private arreglo: any = [];


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private inventarioPrd: InventarioProvider,
    private modalCtrl: ModalController,
  private viewCtrl: ViewController,
) {
  }

  ionViewDidLoad() {
this.inventarioPrd.getsOrdenesCompra().subscribe(datos=>{
this.arreglo=datos;
})
  }

  public actualizando(refresher): any {

    this.inventarioPrd.getsOrdenesCompra().subscribe(datos=>{
      this.arreglo=datos;
      refresher.complete(); 
      })
  }

  public desglose(obj: any) {
    let modal = this.modalCtrl.create(OrdenDetallePage, { parametro: obj });
    modal.present();

  }

  

  public salir():any{
    this.viewCtrl.dismiss({datos:null});
  }

  public agregar(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(OrdenCompraPage)
  }


}
