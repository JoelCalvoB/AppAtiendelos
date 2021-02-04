import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, ToastController, AlertController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ProductosPromocionesAddPage } from '../../pages/productos-promociones-add/productos-promociones-add';
import { PromocionesProvider } from '../../providers/promociones/promociones';


@Component({
  selector: 'page-productos-promociones',
  templateUrl: 'productos-promociones.html',
})
export class ProductosPromocionesPage {

  public arreglo: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toasCtrl: ToastController, private alertaCtrl: AlertController,private globales:GlobalesProvider,
  private promomcionesPrd:PromocionesProvider) {
  }

  public traerPromocion() {
    this.promomcionesPrd.gets().subscribe(respuesta => {
      this.arreglo = respuesta;
    }, error => {
      let alerta = this.toasCtrl.create({ message: error.message + "\n" + error.name, duration: 3000 });
      alerta.present();
      
    });
  }

  ionViewDidEnter() {
    this.traerPromocion();
  }
  public actualizar(obj: any) {
    this.navCtrl.push(ProductosPromocionesAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.id;
    
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.promomcionesPrd.eliminar(id).subscribe(resp => {
            this.promomcionesPrd.gets().subscribe(res => {
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

  public agregar(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ProductosPromocionesAddPage, { boton: "Agregar" })
  }

  public actualizando(refresher): any {
    this.promomcionesPrd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }


  public salir(){
    this.globales.cerrarAplicacion();
  }

}
