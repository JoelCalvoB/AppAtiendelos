import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer, ModalController, Platform } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';
import { MenuSubOrdenPage } from '../../pages/menu-sub-orden/menu-sub-orden';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { ip } from '../../assets/direcciones';

/**
 * Generated class for the MenuSubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-menu-sub',
  templateUrl: 'menu-sub.html',
})
export class MenuSubPage {
  public identificador: any = 0;
  public arreglo: any = [];
  public tipo;

  constructor(public navCtrl: NavController, public navParams: NavParams, private productosPrd: ProductosProvider,
    private modalCtrl: ModalController, private reproductoryoutube: YoutubeVideoPlayer, private plataforma: Platform) {

    this.identificador = this.navParams.get("id_categoria");

    this.productosPrd.getProductosCategoria(this.identificador).subscribe(datos => {
      for (let item of datos)
        item.ruta_imagen = "data:image/png;base64," + item.ruta_imagen;
        this.arreglo = datos;
    });
  }

  public agregarOrden(id_producto): any {
    let modal = this.modalCtrl.create(MenuSubOrdenPage, { id_producto: id_producto });
    modal.present();
  }

  public vervideo(id) {
    if (this.plataforma.is('cordova')) {
      this.reproductoryoutube.openVideo(id);
    } else {
      window.open('https://www.youtube.com/watch?v=' + id);
    }
  }

}
