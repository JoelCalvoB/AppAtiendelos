import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


/**
 * Generated class for the CorteInventarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-corte-inventario',
  templateUrl: 'corte-inventario.html',
})
export class CorteInventarioPage {
  private arreglo: any = [];
  private id_sucursal;
  private id_bodega ;
  private id_user;
  private id_empresa;
  private ubic;



  constructor(public navCtrl: NavController, public navParams: NavParams, public globales: GlobalesProvider, public inventarioPrd:InventarioProvider,    public usuariosPrd: UsuariosProvider,
   public  alertCtrl:AlertController){

      {
        this.id_sucursal = usuariosPrd.getSucursal();

        this.id_empresa =usuariosPrd.getIdUsuario
      }
      this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(otros =>{
        this.arreglo = otros;
        this.ubic = this.arreglo.getsBodega();
      
      })

      this.id_user= this.usuariosPrd.getIdUsuario();
      
  }




 
  public salir(){
    this.globales.cerrarAplicacion();
  }

  public confirmar() {
    let alerta = this.alertCtrl.create({
      subTitle: "¿Deseas cerrar el inventario de esta bodega?",
      message: "Este proceso resteara los parametros del inventario",
      buttons: [{
        text: "sí", handler: () => {

        this.inventarioPrd.CorteXsUc(this.id_sucursal , this.id_user , this.ubic).subscribe(datos=>{

        });
        }
      }, "no"]
    });

    alerta.present();
  }



}


