import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,FabContainer,AlertController,ToastController} from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { SucursalesAddPage } from '../sucursales-add/sucursales-add';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SucursalesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sucursales',
  templateUrl: 'sucursales.html',
})
export class SucursalesPage {

  public arreglo:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private sucursalesPrd:SucursalesProvider,private alertaCtrl:AlertController,private toasCtrl:ToastController,private usuariosPrd:UsuariosProvider,private alertCtrl:AlertController) {
    if(!usuariosPrd.getFree()){
      this.trerSucursales();
    }
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter(){
    if(this.usuariosPrd.getFree()){
      let alerta = this.alertCtrl.create({subTitle:"No se puede gestionar sucursales en modo FREE, favor de contratar todos los servicios",buttons:["Entendido"]});
      alerta.present();
      this.navCtrl.setRoot(TabsPage);
    }
  }

 public trerSucursales():any{
            this.sucursalesPrd.gets().subscribe(datos => {this.arreglo = datos;});
 }

  ionViewDidEnter(){
    this.trerSucursales();

  }
  public actualizando(refresher): any {
    this.sucursalesPrd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  public agregar(){
      this.navCtrl.push(SucursalesAddPage,{boton:"Agregar"});
  }

  public actualizar(obj:any){
    this.navCtrl.push(SucursalesAddPage,{parametro:obj,boton:"Actualizar"});
  }

  public eliminar(obj){
     let id = obj.id;
     let alerta = this.alertaCtrl.create({title:"Aviso",subTitle:"¿Deseas eliminar el registro?",buttons:[{text:"Aceptar",handler:()=>{
      this.sucursalesPrd.eliminar(id).subscribe(resp => {
        this.sucursalesPrd.gets().subscribe(res => {
          this.arreglo = res;
        });
        let toas = this.toasCtrl.create({message:"Registro Eliminado",duration:1500});
        toas.present();
     });

     }},"Cancelar"]});
     

     alerta.present();

  }
}
