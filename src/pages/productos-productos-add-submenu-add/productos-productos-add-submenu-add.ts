import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MenuDesplegableProvider } from '../../providers/menu-desplegable/menu-desplegable';

/**
 * Generated class for the ProductosProductosAddSubmenuAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-productos-productos-add-submenu-add',
  templateUrl: 'productos-productos-add-submenu-add.html',
})
export class ProductosProductosAddSubmenuAddPage {

  private myForm: FormGroup;
  private objForm;
  private tituloButton:string = "";


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController,private formBuilder: FormBuilder,private menuPrd:MenuDesplegableProvider,
    private toastCtrl:ToastController) {
    this.objForm = this.navParams.get("objForm");

    this.tituloButton = this.navParams.get("tituloButton");
    if (this.objForm == undefined) {
      const obj = { nombre: "" ,id_menu:0}
      this.myForm = this.createMyForm(obj);
    } else {
      this.myForm = this.createMyForm(this.tituloButton);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      id_menu:obj.id_menu
    });
  }

  ionViewDidLoad() {
    
  }

  public salir() {
    this.viewCtrl.dismiss();
  }

  saveData() {
    let obj = this.myForm.value;


    obj = {
       id_menu:obj.id_menu,
       nombre:obj.nombre
    }

    if (this.tituloButton == "Actualizar") {
      
      this.menuPrd.modificar(obj).subscribe(datos =>{
        this.mensaje("Registro insertado correctamente");
        this.viewCtrl.dismiss(datos.resultado.nombre);
      });

    } else {
      this.menuPrd.insertar(obj).subscribe(datos => {
    
        this.mensaje("Registro insertado correctamente");
        this.viewCtrl.dismiss(datos);
      });
    }
  }


  public mensaje(mensaje:string){

    let toast = this.toastCtrl.create({message:mensaje,duration:1500});
    toast.present();

  }

}
