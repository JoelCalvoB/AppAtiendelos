import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ReportesVentaFechaPage } from '../reportes-venta-fecha/reportes-venta-fecha';

/**
 * Generated class for the ReporteInventarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reporte-inventario',
  templateUrl: 'reporte-inventario.html',
})
export class ReporteInventarioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private globales: GlobalesProvider) {
  }

  ionViewDidLoad() {
    
  }



  public salir() {
    this.globales.cerrarAplicacion();

  }


  public fechaReportes(opcion) {
    let enviar = "inventarios" + opcion;

    switch (opcion) {
      case 1:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte Entrada y salidas", opcion: enviar });
        break;
      case 2:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por productos", opcion: enviar });
        break;
      case 3:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por tickets", opcion: enviar });
        break;
      case 4:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por insumos", opcion: enviar });
        break;
      default:
        break;

    }
  }


}
