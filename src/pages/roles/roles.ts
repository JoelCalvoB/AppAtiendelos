import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer, AlertController, ToastController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { RolesProvider } from '../../providers/roles/roles';
import { RolesAddPage } from '../roles-add/roles-add';



@Component({
  selector: 'page-roles',
  templateUrl: 'roles.html',
})
export class RolesPage {

  public arreglo: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private rolesPrd: RolesProvider, private alertaCtrl: AlertController, private toasCtrl: ToastController,
    private globales: GlobalesProvider) {
    this.trerRoles();
  }

  ionViewDidLoad() {
      
  }

  public trerRoles(): any {
    this.rolesPrd.gets().subscribe(datos => { 
      
      this.arreglo = datos;
      
     });
  }

  ionViewDidEnter() {
    this.trerRoles();

  }
  public actualizando(refresher): any {
    this.rolesPrd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  public agregar() {
    this.navCtrl.push(RolesAddPage, { boton: "Agregar" });
  }

  public actualizar(obj: any) {
    this.navCtrl.push(RolesAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.id;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.rolesPrd.eliminar(id).subscribe(resp => {
            this.rolesPrd.gets().subscribe(res => {
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

  public salir() {
    this.globales.cerrarAplicacion();
  }
}
