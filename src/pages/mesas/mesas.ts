import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController,FabContainer } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { MesasProvider } from '../../providers/mesas/mesas';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { MesasAddPage } from '../mesas-add/mesas-add';


/**
 * Generated class for the MesasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html',
})
export class MesasPage {
  public arreglo:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private globales:GlobalesProvider,
  private mesasPrd:MesasProvider,private usuariosPrd:UsuariosProvider,private toasCtrl:ToastController,
  private alertaCtrl:AlertController) {
  }

  ionViewDidEnter() {
    this.traerMesas();
  }

  public traerMesas(){
     let id_sucursal = this.usuariosPrd.getSucursal();
    this.mesasPrd.gets(id_sucursal).subscribe(datos =>{
      
      this.arreglo = datos;
    });
  }

  public salir(){
    this.globales.cerrarAplicacion();
  }


  public actualizando(refresher): any {
    let id_sucursal = this.usuariosPrd.getSucursal();
    this.mesasPrd.gets(id_sucursal).subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  public eliminar(obj) {
    
    let id = obj.id_mesa;
    let id_sucursal = this.usuariosPrd.getSucursal();
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.mesasPrd.eliminar(id,id_sucursal).subscribe(resp => {
            let id_sucursal = this.usuariosPrd.getSucursal();
            this.mesasPrd.gets(id_sucursal).subscribe(res => {
              this.arreglo = res;
            });
            let toas = this.toasCtrl.create({ message: "Registro Eliminado", duration: 1500 });
            toas.present();
          });

        }
      }, "Cancelar"]
    });


    alerta.present();

  }

  public actualizar(obj: any) {
    this.navCtrl.push(MesasAddPage, { parametro: obj, boton: "Actualizar" });
  }
  
  public agregar() {
    this.navCtrl.push(MesasAddPage, { boton: "Agregar" })
  }
  
}
