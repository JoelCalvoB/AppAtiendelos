import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,Select } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';
import { ConfiguracionEnlaceProductoinventarioAddPage } from '../../pages/configuracion-enlace-productoinventario-add/configuracion-enlace-productoinventario-add';



@Component({
  selector: 'page-configuracion-enlace-productoinventario',
  templateUrl: 'configuracion-enlace-productoinventario.html',
})
export class ConfiguracionEnlaceProductoinventarioPage {

  public arreglo: any = [];
  public letras: string = "";
  public verdadero: any = [];

  private id ;

  constructor(public navCtrl: NavController, public navParams: NavParams, private productosPrd: ProductosProvider) {
    this.id = this.navParams.get("id_categoria");
    this.productosPrd.getProductosCategoria(this.id).subscribe(datos => {
      this.arreglo = datos;
      this.verdadero = datos;

    });
  }
  ionViewDidEnter() {
    
  }

  public traerProductos(): any {

  }

  public agregarInventario(obj):any{

      this.navCtrl.push(ConfiguracionEnlaceProductoinventarioAddPage,{obj});
  }

  public actualizando(refresher){

    this.productosPrd.getProductosCategoria(this.id).subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  getItems(obj) {
    this.arreglo = this.verdadero.filter(obj => obj.nombre.includes(this.letras));
  }
  
  portChange(event: {
    component: Select,
    value: any 
  }) {
  }

}
