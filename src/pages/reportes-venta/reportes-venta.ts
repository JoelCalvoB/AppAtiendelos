import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ReportesProvider } from '../../providers/reportes/reportes';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ReportesVentaFechaPage } from '../reportes-venta-fecha/reportes-venta-fecha';
import { direcciones } from '../../assets/direcciones';

/**
 * Generated class for the ReportesVentaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reportes-venta',
  templateUrl: 'reportes-venta.html',
})
export class ReportesVentaPage {

  id_sucursal: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private reportesPrd: ReportesProvider,
    private usuariosPrd: UsuariosProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController,private iab:InAppBrowser,private loadCtrl:LoadingController,
  private reportePrd:ReportesProvider) {
    this.id_sucursal = this.usuariosPrd.getSucursal();
  }

  ionViewDidLoad() {
    
  }

  public salir() {


  }


  public totales(): any {

  
    let alerta = this.alertCtrl.create({message:"Visualización del reporte",inputs:[{
      type:"radio",
      checked:true,
      value:"1",
      label:"Pdf"
    },{
     type:"radio",
     value:"2",
     label:"Correo electrónico"
   }],buttons:[{text:"Aceptar",handler: dato =>{
    if(dato == 1){          
      this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/ticket/${this.id_sucursal}/pdf`);
    }else{
      let load = this.loadCtrl.create({content:"Descargando reporte del historial de venta"});
      load.present();
      this.reportePrd.getHistoricoCuentas(this.id_sucursal).subscribe(datos =>{
        load.dismiss();
          this.reportePrd.enviarCorreo(datos.respuesta,"Historial de cuentas");
      });
    }
    }}]});
   
    alerta.present();


  }

  public fechaReportes(opcion) {
    let enviar = "ventas"+opcion;
    switch (opcion) {
      case 1:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por fechas", opcion: enviar });
        break;
      case 2:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por mesas", opcion: enviar });
        break;
      case 3:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por meseros", opcion: enviar });
        break;
      case 4:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por sucursales", opcion: enviar });
        break;
      case 5:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte detalle por mesa", opcion: enviar });
        break;
      case 6:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte por barra y cocina", opcion: enviar });
        break;
        case 8:
        this.navCtrl.push(ReportesVentaFechaPage, { nombre_reporte: "Reporte de productos", opcion: enviar });
        break;
      default:
        break;

    }
  }


}
