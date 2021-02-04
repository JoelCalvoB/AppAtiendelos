import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { GlobalesProvider } from '../../providers/globales/globales';


@Component({
  selector: 'page-bar',
  templateUrl: 'bar.html',
})
export class BarPage {

  public arreglo: any = [];
  private ultimamodificacion;
  private minutos;
  private notificar = -1;
  private id_sucursal;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ticketPrd: TicketsProvider,
    private alerta: AlertController, private toasCtrl: ToastController, private usuariosPrd: UsuariosProvider,
    private globales:GlobalesProvider) {

    this.id_sucursal = usuariosPrd.getSucursal();
    this.ticketPrd.notificaciones(this.id_sucursal,2).subscribe(datos => {
      this.arreglo = datos;
      this.ultimamodificacion = new Date();
    });
  }


  ionViewDidEnter() {
    setTimeout(() => {
      this.ticketPrd.getNotificacion().subscribe(datosnotificar => {
        if (datosnotificar.notificar != this.notificar) {
          this.ticketPrd.notificaciones(this.id_sucursal,2).subscribe(datos => {
            this.arreglo = datos;
            this.ultimamodificacion = new Date();
            this.notificar = datosnotificar.notificar;
          });
        } else {
          let ahora: any = new Date();

          var diferencia = ahora - this.ultimamodificacion;
          diferencia /= 1000;
          diferencia = Math.floor(diferencia / 60);
          this.minutos = Math.round(diferencia % 60);
          if (this.minutos >= 1) {
            this.ticketPrd.notificaciones(this.id_sucursal,2).subscribe(datos => {
              this.arreglo = datos;

            });
            this.ultimamodificacion = new Date();

          }


        }
        this.ionViewDidEnter();
      });
    }, 1000);
  }

  public actualizando(refresher): any {
    this.ticketPrd.notificaciones(this.id_sucursal,2).subscribe(datos => {
      this.arreglo = datos;
      refresher.complete();
    });
  }


  public servido(obj): any {
    let enviarObj = {
      id_ticket: obj.id_ticket,
      id_producto: obj.id_producto,
      cantidad: obj.cantidad,
      servido: true,
      id: obj.id
    };

    let alerta = this.alerta.create({
      title: "Aviso", message: "¿El producto ya fue servido?", buttons: [
        {
          text: "Sí", handler: () => {
            this.ticketPrd.detallecocineroactualizar(enviarObj).subscribe(datos => {
              let toas = this.toasCtrl.create({ message: datos.respuesta, duration: 1500 });
              toas.present();
            });
          }
        }, {
          text: "No"
        }
      ]
    });
    alerta.present();
  }

  public salir(){
    this.globales.cerrarAplicacion();
  }

}
