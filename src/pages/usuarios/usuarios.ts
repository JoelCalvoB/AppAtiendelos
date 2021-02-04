import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, FabContainer, AlertController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { UsuariosAddPage } from '../usuarios-add/usuarios-add';
import { GlobalesProvider } from '../../providers/globales/globales';

/**
 * Generated class for the UsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  public arreglo: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private usuariosprd: UsuariosProvider,
    private toasCtrl: ToastController, private alertaCtrl: AlertController,private globales:GlobalesProvider) {
    this.traerUsuarios();
  }

  public traerUsuarios() {
    this.usuariosprd.gets().subscribe(respuesta => {
      this.arreglo = respuesta;
    }, error => {
      let alerta = this.toasCtrl.create({ message: error.message + "\n" + error.name, duration: 3000 });
      alerta.present();
      
    });
  }

  ionViewDidEnter() {
    this.traerUsuarios();
  }
  public actualizar(obj: any) {
    this.navCtrl.push(UsuariosAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.login;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.usuariosprd.eliminar(id).subscribe(resp => {
            this.usuariosprd.gets().subscribe(res => {
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

  public agregar() {
    this.navCtrl.push(UsuariosAddPage, { boton: "Agregar" })
  }

  public actualizando(refresher): any {
    this.usuariosprd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }


  public salir(){
    this.globales.cerrarAplicacion();
  }
}
