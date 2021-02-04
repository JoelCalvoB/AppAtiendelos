import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform, ModalController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ImpresionesProvider } from '../../providers/impresiones/impresiones';
import { GlobalesProvider } from '../../providers/globales/globales';
import { CuentasDetallePage } from '../cuentas-detalle/cuentas-detalle';

/**
 * Generated class for the CuentasVisualizacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-cuentas-visualizacion',
  templateUrl: 'cuentas-visualizacion.html',
})
export class CuentasVisualizacionPage {
 private id_sucursal:any = 0;
 private arreglo:any = [];
 private cargadoicon:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private ticketsprd:TicketsProvider,
    private usuariosPrd:UsuariosProvider,private loadCtrl:LoadingController,private impresionesPrd:ImpresionesProvider,private globales:GlobalesProvider,
    private toasCtrl:ToastController,private platform:Platform,private modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.cargadoicon = false;

    //Se envia como 0 porque asi se puede obtener de todas las mesas
    this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, 0).subscribe(datos => {
      this.cargadoicon = false;
      for (let item of datos) {
        item.ocupada = true;
        item.colorear = true;
      }
      this.arreglo = datos;
      
    });
  }


  public preticketImprimir(objpreticket) {

    let idSucursal = this.usuariosPrd.getSucursal();

    let objTicket = {
      id_mesa: objpreticket.id_mesa,
      id_sucursal: idSucursal,
      id_ticket: objpreticket.id_ticket,
      nombre: objpreticket.nombre
    }

    let loading = this.loadCtrl.create({ content: "Imprimiendo preticket" });
    loading.present();

    this.impresionesPrd.getPreticket(objTicket).then(mensaje => {


      let configura = this.globales.getConfiguraciones();
      let wifi: boolean = false;
      let activarImpresora: boolean = false;
      if (configura != undefined || configura != null) {
        wifi = configura.esImpresoraWifi;
        activarImpresora = configura.impresoraCajero;
      }

      wifi = wifi == undefined ? false : wifi;
      activarImpresora = activarImpresora == undefined ? false : activarImpresora;

      if (activarImpresora == true) {
        if (wifi == true) {
   
          this.impresionesPrd.enviarWifiCajero(mensaje).subscribe(datos => {
          });
        } else {
          if (this.platform.is('cordova')) {
            this.globales.conectarCajero(mensaje);
          }
        }
      } else {
        let toast = this.toasCtrl.create({ message: "Impresora  de caja desactivada. Activar en configuraciones", closeButtonText: "Aceptar", showCloseButton: true });
        toast.present();
      }

      loading.dismiss();
    }).catch(err => {
      let toast = this.toasCtrl.create({ message: err, duration: 1500 });
      toast.present();
      loading.dismiss();
    });


  }

  public addOrden(objtik) {
    let objTicket = {
      id_mesa: objtik.id_mesa,
      id_sucursal: objtik.id_sucursal,
      id_ticket: objtik.id_ticket,
      nombre: objtik.nombre,
      id_folio: objtik.id_folio
    }


    let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: objTicket,consulta:true });
    modal.present();
    modal.onDidDismiss(datos => {
      if (datos != undefined) {

      }
    });
  }

}
