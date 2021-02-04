import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';

/**
 * Generated class for the OrdenDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orden-detalle',
  templateUrl: 'orden-detalle.html',
})
export class OrdenDetallePage {

  private variable;
public folio="";
public fecha="";
public elaboro="";
private desglose: any = [];


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private inventarioPrd: InventarioProvider,
     private parametros: NavParams,
     private  viewCtrl:ViewController

    ) {
this.variable= this.parametros.get("parametro");
this.folio= this.variable.folio;
this.fecha= this.variable.fecha;
this.elaboro= this.variable.elaboro; 


this.inventarioPrd.getDesgloseOrden(this.folio).subscribe(datos=>{
this.desglose=datos;
})


    
  }

  ionViewDidLoad() {
    
  }

  public salir():any{
    this.viewCtrl.dismiss({datos:null});
  }

}
