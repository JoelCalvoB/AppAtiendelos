import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';
import {MedidasAddPage} from '../medidas-add/medidas-add';
/**
 * Generated class for the MedidasInventarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-medidas-inventario',
  templateUrl: 'medidas-inventario.html',
})
export class MedidasInventarioPage {
  private arreglo: any = [];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private inventarioPrd: InventarioProvider) {
  }

  ionViewDidLoad() {
    this.inventarioPrd.getsMedida().subscribe(datos => {
      this.arreglo = datos;
  

  });

  }


  public agregar(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(MedidasAddPage, { boton: "Agregar" })
  }

  
  public actualizando(refresher): any {

    this.inventarioPrd.getsMedida().subscribe(datos => {
      this.arreglo = datos;
      refresher.complete();
    });
  }
}
