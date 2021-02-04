import { Component, ViewRef } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer,ViewController,ModalController,AlertController,ToastController } from 'ionic-angular';
import {AltaProveedorPage} from '../alta-proveedor/alta-proveedor';
import { InventarioProvider } from '../../providers/inventario/inventario';
/**
 * Generated class for the ProveedorAdministradorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-proveedor-administrador',
  templateUrl: 'proveedor-administrador.html',
})
export class ProveedorAdministradorPage {
  private arreglo: any = [];
  public verdadero: any = [];
  public letras: string = "";



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private inventarioPrd: InventarioProvider,
    private alertaCtrl: AlertController,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
  private viewCtrl: ViewController ) {
  }


  ionViewDidEnter() {

    this.inventarioPrd.getsProveedor().subscribe(datos => {
       this.arreglo = datos;
       
       this.verdadero = datos;
    });
  }


  public agregar(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(AltaProveedorPage, { boton: "Agregar" })
  }


  public actualizando(refresher): any {

    this.inventarioPrd.getsProveedor().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }
  
  getItems(obj) {
    this.arreglo = this.verdadero.filter(obj => obj.nombre.includes(this.letras));
  }


  public eliminarProveedor(obj) {
    let id = obj.id_proveedor;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.inventarioPrd.eliminarProveedor(id).subscribe(resp => {
            this.inventarioPrd.getsProveedor().subscribe(res => {
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


  public desglose(obj: any) {
    let modal = this.modalCtrl.create(AltaProveedorPage, { parametro: obj });
    modal.present();

  }

  public salir():any{
    this.viewCtrl.dismiss({datos:null});
  }

}
