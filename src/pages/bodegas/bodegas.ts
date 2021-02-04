import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { InventarioProvider } from '../../providers/inventario/inventario';
import {AdminBodegasPage} from '../admin-bodegas/admin-bodegas';


/**
 * Generated class for the BodegasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bodegas',
  templateUrl: 'bodegas.html',
})

export class BodegasPage {
  private id_sucursal;
  private arreglo1: any = [];


  constructor(public navCtrl: NavController,
    private inventarioPrd: InventarioProvider, 
    public navParams: NavParams,
    private usuariosPrd: UsuariosProvider,private alertaCtrl: AlertController,
    private toasCtrl: ToastController) {
    this.id_sucursal = usuariosPrd.getSucursal();

  }

  ionViewDidEnter() {

    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(datos => {
       this.arreglo1 = datos;
    });
  }

  public actualizando(refresher): any {

    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(res => {
      this.arreglo1 = res;
      refresher.complete();
    });
  }

  public agregar() {
    this.navCtrl.push(AdminBodegasPage, { boton: "Agregar" })
  }



  public eliminar(obj) {
    let id = obj.id_bodega;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.inventarioPrd.eliminarBodega(id).subscribe(resp => {
            this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(res => {
              this.arreglo1 = res;
            });
            let toas = this.toasCtrl.create({ message: "Registro Eliminado", duration: 1500 });
            toas.present();
          });

        }
      }, "Cancelar"]
    });


    alerta.present();

  }

  

}
