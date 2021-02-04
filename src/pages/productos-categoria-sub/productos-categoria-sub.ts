import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductosProductosPage } from '../productos-productos/productos-productos';

/**
 * Generated class for the ProductosCategoriaSubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-productos-categoria-sub',
  templateUrl: 'productos-categoria-sub.html',
})
export class ProductosCategoriaSubPage {
  public obj;
  public arreglo = [];
  public secuencia = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.obj = navParams.get("categoria");
    this.arreglo = this.obj.submenu_array;
  }

  ionViewDidLoad() {
    
  }

  public abrirproductos(item){

      if(item.submenu != true){
        this.navCtrl.push(ProductosProductosPage,{categoria:this.obj,esSubcategoria:true,secuencia:item.id});
      }else{
        
        this.obj.submenu_array = item.submenu_array;
        this.navCtrl.push(ProductosCategoriaSubPage,{categoria:this.obj,secuencia:item.id});
      }
  }

}
