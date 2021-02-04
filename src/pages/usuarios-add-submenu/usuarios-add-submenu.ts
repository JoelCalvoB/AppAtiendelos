import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';


/**
 * Generated class for the UsuariosAddSubmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-usuarios-add-submenu',
  templateUrl: 'usuarios-add-submenu.html',
})
export class UsuariosAddSubmenuPage {


  public arreglo:any =[
    {nombre:"inicio",activo:false,visualizar:true},
    {nombre:"gestion usuarios",activo:false,visualizar:false},
    {nombre:"sucursales",activo:false,visualizar:false},
    {nombre:"mesas",activo:false,visualizar:false},
    {nombre:"caja",activo:false,visualizar:false},
    {nombre:"productos",activo:false,visualizar:false},
    {nombre:"historial cuentas",activo:false,visualizar:false},
    {nombre:"reportes",activo:false,visualizar:false},
    {nombre:"autorizar",activo:false,visualizar:false},
    {nombre:"inventario",activo:false,visualizar:false},
    {nombre:"configuraciones",activo:false,visualizar:false}];

    public relationship = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
      let objTemporal = navParams.get("menu");
      
      
      if(objTemporal != null || objTemporal !=  undefined){
       this.relationship = objTemporal.activoEn;
         for(let item of this.arreglo){
            for(let i of objTemporal.menu){
                if(i.nombre == item.nombre){
                    item.activo = true;
                }
            }
         }
      }
  }

  ionViewDidLoad() {
    
  }

  public salir(){
    this.viewCtrl.dismiss();
  }


  public guardarCambios(){
    

    let arregloEnviar = [];

    for(let item of this.arreglo){
       if(item.activo == true){
          arregloEnviar.push(item);
       }
    }
    
    let objMenu = {
      menu:arregloEnviar,
      activoEn:this.relationship
    }

    this.viewCtrl.dismiss(objMenu);
  }

}
