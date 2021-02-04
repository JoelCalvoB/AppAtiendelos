import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ProductosCategoriaPage } from '../productos-categoria/productos-categoria';
import { ProductosProductosPage } from '../productos-productos/productos-productos';
import { ProductosPromocionesPage } from '../productos-promociones/productos-promociones';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html',
})
export class ProductosPage {

  private esfree:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private globales:GlobalesProvider,
    private usuariosPrd:UsuariosProvider) {
  }

  ionViewDidLoad() {
       this.esfree = this.usuariosPrd.getFree();
  }


  public salir(){
    this.globales.cerrarAplicacion();
  }

  public abrirVentana(obj){
    switch(obj){
      case "productos":
          this.navCtrl.push(ProductosCategoriaPage,{esProductos:true});
      break;
      case "categorias":
      this.navCtrl.push(ProductosCategoriaPage,{esProductos:false});
      break;
      case "promociones":
      this.navCtrl.push(ProductosPromocionesPage);
      break;
    }
  }

  
}
