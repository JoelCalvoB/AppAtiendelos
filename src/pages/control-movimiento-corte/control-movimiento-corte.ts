import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { InventarioProvider } from '../../providers/inventario/inventario';

/**
 * Generated class for the ControlMovimientoCortePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-control-movimiento-corte',
  templateUrl: 'control-movimiento-corte.html',
})
export class ControlMovimientoCortePage {

  private descripcion:string = "";
  private fecha:string = "";
  private nombre_bodega:string = "";
  private total = 0;
  private cantidad_real = 0;
  private id_inventario;
  private id_usuario;
  private id_ubicacion;
  private id_sucursal;


  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,private alertCtrl:AlertController,private usuariosPrd:UsuariosProvider,
  private inventarioPrd:InventarioProvider,private toast:ToastController) {
    this.descripcion = navParams.get("descripcion");
    this.nombre_bodega = navParams.get("nombre_bodega");
    this.total = navParams.get("total");
    this.id_inventario = navParams.get("id_inventario");
    this.id_usuario = usuariosPrd.getIdUsuario();
    this.id_ubicacion = navParams.get("id_ubicacion");
    this.id_sucursal = navParams.get("id_sucursal");

    let f = new Date();
    let mes = f.getMonth() < 10 ? "0"+f.getMonth():f.getMonth();
   this.fecha = `${f.getDay()}/${mes}/${f.getFullYear()}`;
    

   

  }

  ionViewDidLoad() {
  }

  public salir(){
    this.viewCtrl.dismiss();
  }


  public finalizar(cantidad){
      let alerta = this.alertCtrl.create({message:"¿Deseas realizar el corte de caja?",buttons:[{
        text:"Si",handler:()=>{
            let obj ={
              id_inventario:this.id_inventario,
              cantidad_real:cantidad,
              cantidad_programa:this.total,
              id_usuario:this.id_usuario,
              id_ubicacion:this.id_ubicacion,
              id_sucursal:this.id_sucursal
            };


          

            this.inventarioPrd.insertarInventarioCorte(obj).subscribe(datos =>{

              
              this.viewCtrl.dismiss({realizado:true,cantidad:cantidad,id_corte:datos.id_corte});


            },err =>{
              let toast = this.toast.create({message:"Error al realizar el corte de caja",showCloseButton:true,closeButtonText:"Entendido"});
              toast.present();
            } );
        }
      },"No"]});


      alerta.present();
  }

}
