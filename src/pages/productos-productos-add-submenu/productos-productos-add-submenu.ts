import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { ProductosProductosAddSubmenuAddPage } from '../productos-productos-add-submenu-add/productos-productos-add-submenu-add';
import { MenuDesplegableProvider } from '../../providers/menu-desplegable/menu-desplegable';

/**
 * Generated class for the ProductosProductosAddSubmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-productos-productos-add-submenu',
  templateUrl: 'productos-productos-add-submenu.html',
})
export class ProductosProductosAddSubmenuPage {

  private arreglo:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl:ViewController,private modalCtrl:ModalController,
    private sunbmenuPrd:MenuDesplegableProvider,private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    let seleccionados = this.navParams.get("menu");
    seleccionados = (seleccionados == undefined || seleccionados == null)?[]:seleccionados;
    this.sunbmenuPrd.gets().subscribe(datos =>{

       for(let item of datos){
         let activo:boolean = false;
         for(let item2 of seleccionados){
            if(item.nombre.includes(item2.nombre)){
                activo = true;
                break;
            }
         }

         item.activo = activo;
       }
       this.arreglo = datos;
    });
  }

  public salir(){
    this.viewCtrl.dismiss();
  }


  public aceptar(){
    let arregloenviar = [];
    for(let item of this.arreglo){
      if(item.activo){
          arregloenviar.push(item);
      }
    }

 
    let alert = this.alertCtrl.create({subTitle:"Tipo menu desplegable",message:"Seleccionar como se visualizara el menu desplegable en la venta",inputs:[
      {type:"radio",name:"descriptivo",checked:true,value:'descriptivo',label:"Descriptivo"},
      {type:"radio",name:"cantidad",value:'cantidad',label:"Por cantidad"}
    ],buttons:[{text:"Aceptar",handler:(datos)=>{
 
      this.viewCtrl.dismiss({arreglo:arregloenviar,tipo:datos});
    }},"Cancelar"]});
    alert.present();
  }


  public agregar(){
    let modal = this.modalCtrl.create(ProductosProductosAddSubmenuAddPage,{tituloButton:'Agregar'},{
      cssClass:'margen_modal'
    });
    modal.present();

    modal.onDidDismiss(datos =>{
      if(datos != undefined){
      
           this.arreglo.push(datos);
      }
    });
  }

}
