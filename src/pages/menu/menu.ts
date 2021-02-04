import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App,ToastController, Slide, Slides, Item} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { GlobalesProvider } from '../../providers/globales/globales';
import { MenuSubPage } from '../../pages/menu-sub/menu-sub';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { Storage } from '@ionic/storage';
import { ProductosProvider } from '../../providers/productos/productos';

;


/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild('slideWithNav3') slideWithNav3: Slides;
  public arreglo: any = [];
  public id_sucursal;
  public estadoSlide = {
    isBeginningSlide:true,
    isEndSlide:false
  }

  private loadIcon:boolean = false;
  private subcategorias:any = [];
  private nombreClick:string = "";


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private appCtrl: App, private categoriaPrd: CategoriasProvider,
    private globales: GlobalesProvider, private toasCtrl:ToastController,private usuariosPdr:UsuariosProvider,private storage: Storage,
    private productosPrd:ProductosProvider) {
  }

  ionViewDidLoad() {
    this.categoriaPrd.gets().subscribe(datos => {
      this.arreglo = datos;

    });

    
  
      
  }
  ionViewDidEnter() {

  }

  public salir(): any {
    this.globales.cerrarAplicacion();
  }

  public subcatalogo(id_categoria,nombre) {
    //this.navCtrl.push(MenuSubPage, { id_categoria: id_categoria });

    this.loadIcon = true;
    this.nombreClick = nombre;
    this.subcategorias = [];

    this.productosPrd.getProductosCategoria(id_categoria).subscribe(datos => {
      
      for (let item of datos)
        item.ruta_imagen = "data:image/png;base64," + item.ruta_imagen;
        
        
        this.subcategorias = datos;
        this.loadIcon = false;
    });

  
  }


  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView:Slides) {
    if(slideView.isBeginning()){
       this.estadoSlide.isBeginningSlide = true;
    }else{

      this.estadoSlide.isBeginningSlide = false;
    }
  }
  checkisEnd(object, slideView:Slides) {
    if(slideView.isEnd()){
       this.estadoSlide.isEndSlide = true;
    }else{
      this.estadoSlide.isEndSlide = false;
    }
  }

  slideNext(object, slideView:Slides) {
    slideView.slideNext(500);
    this.checkIfNavDisabled(object, slideView);
  
  }

  //Move to previous slide
  slidePrev(object, slideView:Slides) {
    slideView.slidePrev(500);
    this.checkIfNavDisabled(object, slideView);
  }

}
