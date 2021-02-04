import { Component } from '@angular/core';
import { NavController, NavParams, FabContainer, AlertController, ToastController, LoadingController,ModalController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { CortecajaProvider } from '../../providers/cortecaja/cortecaja';
import { CajaCortePage } from '../caja-corte/caja-corte';
import { ReportesVentaFechaPage } from '../reportes-venta-fecha/reportes-venta-fecha';

@Component({
  selector: 'page-caja-corte-inicio',
  templateUrl: 'caja-corte-inicio.html',
})
export class CajaCorteInicioPage {

  public id_sucursal;
  public arreglo = [];
  public offset = 0;
  public dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    private usuarioPrd: UsuariosProvider, private cortecajaPrd: CortecajaProvider, private toastCtrl: ToastController,
    private corteCaja: CortecajaProvider, private loadCtrl: LoadingController, private toast: ToastController,private modalCtrl:ModalController) {
    this.id_sucursal = usuarioPrd.getSucursal();
  }

  ionViewDidLoad() {

    if(!this.usuarioPrd.getFree()){
      this.arreglo = [];
      let load = this.loadCtrl.create({ content: "Cargando cortes de caja" });
      load.present();
      this.cortecajaPrd.obtenerCortesCaja(this.id_sucursal, this.offset).subscribe(datos => {
  
  
        for (let item of datos) {
          let dia = new Date(item.fecha);
          item.dianombre = this.dias[dia.getDay()];
          this.arreglo.push(item);
        }
        load.dismiss();
      });
    }else{
    }
  }


  public nuevo() {
    let abrir: boolean = true;
    for (let item of this.arreglo) {

      if (item.cerrada == false) {
        abrir = false;
        break;
      }
    }

    if (abrir) {
      let alerta = this.alertCtrl.create({
        subTitle: "Apertura en caja", inputs: [{
          type: "number",
          name: "efectivo",
          placeholder: "Efectivo en caja"
        }], buttons: [ {
          text: "Aceptar", handler: datos => {
            let efectivo = datos.efectivo;
            let obj = {
              efectivo_apertura: efectivo,
              id_sucursal: this.id_sucursal
            }

            this.cortecajaPrd.insertarCorte(obj).subscribe(respuesta => {
              let toast = this.toastCtrl.create({ message: "Corte de caja abierta", duration: 1500 });
              toast.present();
              this.offset = 0;
              this.ionViewDidLoad();
            });

          }
        },"Cancelar"]
      });

      alerta.present();
    } else {
      let alerta = this.alertCtrl.create({
        message: "Existen corte de caja abierta, favor de cerrar corte de caja",
        buttons: ["Entendido"]
      });
      alerta.present();
    }

  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      this.offset = this.offset + 10;
      this.cortecajaPrd.obtenerCortesCaja(this.id_sucursal, this.offset).subscribe(datos => {
        for (let item of datos) {
          let dia = new Date(item.fecha);
          item.dianombre = this.dias[dia.getDay()];
          this.arreglo.push(item);
        }
        resolve();
      });
    })
  }


  public abrirCorte(obj) {
    this.navCtrl.push(CajaCortePage, { obj: obj });
  }

  public reporte(){
    let enviar = "ventas7";
    let modal = this.modalCtrl.create(ReportesVentaFechaPage, { nombre_reporte: "Reporte por fechas", opcion: enviar,esmodal:true },{
      cssClass:'margen_modal'
    });
    modal.present();
  }

}
