import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { TicketsPage } from '../tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ReportesProvider } from '../../providers/reportes/reportes';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { GlobalesProvider } from '../../providers/globales/globales';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { direcciones } from '../../assets/direcciones';

/**
 * Generated class for the AuditoriaDesglosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-auditoria-desglose',
  templateUrl: 'auditoria-desglose.html',
})
export class AuditoriaDesglosePage {
  public arreglo: any = [];
  public fecha;
  public id_sucursal;


  constructor(public navCtrl: NavController, public navParams: NavParams, private ticktPrd: TicketsProvider,
    private usuariosPrd: UsuariosProvider, private sucursalesPrd: SucursalesProvider,
    private reportePrd: ReportesProvider, private document: DocumentViewer, private platadorma: Platform,
    private alertCtrl: AlertController, private file: File, private ft: FileTransfer,
    private toasCtrl: ToastController, private loadCtrl: LoadingController,
    private globales: GlobalesProvider,private iab: InAppBrowser) {

    this.id_sucursal = usuariosPrd.getSucursal();
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let dia: string = "";
    let mes: string = "";

    if (dd < 10) {
      dia = "0" + dd;
    } else {
      dia = "" + dd;
    }

    if (mm < 10) {
      mes = '0' + mm;
    } else {
      mes = "" + mm;
    }

    this.fecha = yyyy + '-' + mes + '-' + dia;
    this.ticktPrd.getTicketsCanceladosCobrados(this.id_sucursal, undefined).subscribe(datos => {
      this.arreglo = datos;
    });

  }

  ionViewDidLoad() {
  }

  public buscar() {

    this.ticktPrd.getTicketsDesgloseEspecial(this.id_sucursal, this.fecha).subscribe(datos => {
      this.arreglo = datos;
    });
  }

  public entrarDetalle(obj) {
    let bandera_tipo:true;
    this.navCtrl.push(TicketsPage, { id_ticket: obj.id_ticket , bandera_tipo:true }  );
  }

  public reporte(): any {

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


  public salir() {
    this.globales.cerrarAplicacion();
  }

}
