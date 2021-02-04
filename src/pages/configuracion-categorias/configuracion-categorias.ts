import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfiguracionEnlaceProductoinventarioPage } from '../configuracion-enlace-productoinventario/configuracion-enlace-productoinventario';
import { CategoriasProvider } from '../../providers/categorias/categorias';

/**
 * Generated class for the ConfiguracionCategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-configuracion-categorias',
  templateUrl: 'configuracion-categorias.html',
})
export class ConfiguracionCategoriasPage {

  private arreglo:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private categoriasPrd:CategoriasProvider) {
    this.categoriasPrd.gets().subscribe(datos =>{
      this.arreglo = datos;
    });
  }

  ionViewDidLoad() {
  }

  public abrirPagina(identificador){

    this.navCtrl.push(ConfiguracionEnlaceProductoinventarioPage,{id_categoria:identificador});
  }

}
