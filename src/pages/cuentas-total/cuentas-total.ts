import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ToastController,ActionSheetController,ModalController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasResumenPage } from '../cuentas-resumen/cuentas-resumen';

/**
 * Generated class for the CuentasTotalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-cuentas-total',
  templateUrl: 'cuentas-total.html',
})
export class CuentasTotalPage {

  public id_ticket;
  public detalle:any = [];
  public total = 0;
  public servidosTodos:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
  private ticketsPrd:TicketsProvider,private alertaCtrl:AlertController,private toastCtrl:ToastController,
  private actionSheetCtrl:ActionSheetController,private modalCtrl:ModalController) {

    this.id_ticket = navParams.get("id_ticket");
    

    this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
      this.detalle = datos;
      this.total = 0;
      for (let item of datos) {
        if (item.cancelado == true) {
          item.cantidad = 0;
        }
        this.total = this.total + (item.cantidad * item.precio);
        if (this.servidosTodos == true) {
          if (item.servido == false) {
            this.servidosTodos = false;
          }
        }
      }
    });
  }

  ionViewDidLoad() {
    
  }

  public salir(){
    this.viewCtrl.dismiss();
  }

  public cancelardetalle(obj): any {
    let alerta = this.alertaCtrl.create({
      title: "Aviso",
      message: "¿Desea cancelar el producto?",
      buttons: [{
        text: "Sí", handler: () => {
          let objenviar = {
            id: obj.id,
            id_producto:obj.id_producto,
            cantidad: obj.cantidad,
            cancelado: true
          }

          this.ticketsPrd.cancelarDetalleTicket(objenviar).subscribe(respuesta => {
            let toas = this.toastCtrl.create({ message: "Producto cancelado", duration: 1500 });
            toas.present();
            this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
              this.detalle = datos;
              this.total = 0;
              for (let item of datos) {
                if (item.cancelado == true) {
                  item.cantidad = 0;
                }
                this.total = this.total + (item.cantidad * item.precio);
                if (this.servidosTodos == true) {
                  if (item.servido == false) {
                    this.servidosTodos = false;
                  }
                }
              }
            });
          });
        }
      }, { text: "No" }]
    });
    alerta.present();
  }

  public modificaCuenta(obj) {

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'action-sheets-groups-page',
      buttons: [
        {
          text: 'Modificar',
          icon: "brush",
          handler: () => {
            let alerta = this.alertaCtrl.create({
              buttons: [{ text: "Cancelar" }, {
                text: "Actualizar", handler: data => {
                  obj.cantidad = data.texto;
                  let objenviar = {
                    id: obj.id,
                    cantidad: obj.cantidad,
                    cancelado: false
                  }

                  this.ticketsPrd.actualizarDetalleTicket(obj).subscribe(respues1 => {
                    let toas = this.toastCtrl.create({ message: respues1.respuesta, duration: 1500 });
                    toas.present();
                    this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
                      this.detalle = datos;
                      this.total = 0;
                      for (let item of datos) {
                        if (item.cancelado == true) {
                          item.cantidad = 0;
                        }
                        this.total = this.total + (item.cantidad * item.precio);
                        if (this.servidosTodos == true) {
                          if (item.servido == false) {
                            this.servidosTodos = false;
                          }
                        }
                      }
                    });
                  });
                }
              }], inputs: [{ type: "number", value: obj.cantidad, name: "texto" }], title: "Cantidad en orden"
            });
            alerta.present();
          }
        },
        {
          text: 'Eliminar',
          icon: "trash",
          handler: () => {
            const alerta = this.alertaCtrl.create({
              title: "Aviso",
              subTitle: "¿Desea eliminar el producto de la orden?",
              buttons: [{
                text: "Aceptar",
                handler: () => {
                  this.ticketsPrd.eliminarDetalleTicket(obj.id).subscribe(respu => {
                    let toast = this.toastCtrl.create({ message: "Productos eliminados", duration: 1500 });
                    toast.present();
                    this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
                      this.detalle = datos;
                      this.total = 0;
                      for (let item of datos) {
                        if (item.cancelado == true) {
                          item.cantidad = 0;
                        }
                        this.total = this.total + (item.cantidad * item.precio);
                        if (this.servidosTodos == true) {
                          if (item.servido == false) {
                            this.servidosTodos = false;
                          }
                        }
                      }
                    });
                  });

                }
              },
              {
                text: "Cancelar"
              }]
            });
            alerta.present();
          }
        }, {
          text: 'Cancelar',
          icon: "close",
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();

  }

}
