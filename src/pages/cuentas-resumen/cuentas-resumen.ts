import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { GlobalesProvider } from '../../providers/globales/globales';
import { PaypalPage } from '../../pages/paypal/paypal';
import { CuentasResumenPagarPage } from '../cuentas-resumen-pagar/cuentas-resumen-pagar';

@Component({
  selector: 'page-cuentas-resumen',
  templateUrl: 'cuentas-resumen.html',
})
export class CuentasResumenPage {
  public arreglo: any = [];
  private id_ticket;
  public total = 0;
  public promociones: any = [];
  public totalPromocion = 0;
  public productosDescontar = 0;
  public totalNeto = 0;
  public cortesia = 0;
  public descontar_ticket = 0;
  public totalPagar = 0;
  public iva: boolean = false;
  public totaliva;
  public totalglobal;
  public ivarecupera: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private ticketsPrd: TicketsProvider, private alertCtrl: AlertController, private toasCtrl: ToastController,
    private globales: GlobalesProvider, private modalCtrl: ModalController) {
    let glob = this.globales.getConfiguraciones();
    if (glob != undefined && glob != null) {
      this.iva = glob.iva;
      this.ivarecupera = glob.ivarecupera;
    }

    this.iva = (this.iva == undefined) ? false : this.iva;
    this.ivarecupera = (this.ivarecupera == undefined) ? false : this.ivarecupera;

    this.id_ticket = this.navParams.get("id_ticket");

    this.ticketsPrd.getTicketsDetalleAgrupado(this.id_ticket).subscribe(resultado => {
      let datos = resultado.resultado;
      this.promociones = resultado.promociones;

      this.arreglo = datos;

      this.cortesia = 0;
      this.descontar_ticket = 0;

      for (let i of datos) {
        this.total = this.total + i.precio_total;
        this.cortesia = i.cortesia_ticket;
        this.descontar_ticket = i.descontar_ticket;
      }

      if (this.cortesia == 1) {
        this.totalPagar = this.total - this.descontar_ticket;
      } else if (this.cortesia == 2) {
        this.totalPagar = this.total - (this.total * this.descontar_ticket) / 100;
      } else if (this.cortesia == 3) {
        this.totalPagar = 0;
      }




      for (let item of this.promociones) {
        this.totalPromocion = this.totalPromocion + (item.totalPromocion * item.precio);
        for (let producto of item.productos) {
          this.productosDescontar = this.productosDescontar + producto.total;
        }
      }

      this.totalNeto = this.total - this.productosDescontar;
      this.totalNeto = this.totalNeto + this.totalPromocion;

    });
  }

  ionViewDidLoad() {
    
  }


  public salir() {
    this.viewCtrl.dismiss();
  }

  public cobrar(): any {

    let cantidadPagar = this.total;
    if (this.promociones.length > 0) {
      cantidadPagar = this.totalNeto;
    }

    if (this.cortesia != 0) {
      cantidadPagar = this.totalPagar;
    }


    if (this.iva == true) {
      cantidadPagar = ((cantidadPagar * 16) / 100) + cantidadPagar;
    }

    let modal = this.modalCtrl.create(CuentasResumenPagarPage, { cantidad_pagar: cantidadPagar },{cssClass:'margen_modal'});
    modal.present();

    modal.onDidDismiss(datos => {
      if (datos != undefined) {
        let radio = datos.radio;
        let parametro = (radio == "T") ? false : true;

        

        this.cobrarTicketMetodo(datos, radio, parametro);
      }
    });



    let tipoPago = this.alertCtrl.create({
      title: "Tipo de pago",
      message: "Seleccionar el tipo de pago",
      inputs: [
        { type: "radio", label: "Efectivo", value: "E", checked: true },
        { type: "radio", label: "Tarjeta de crédito / débito", value: "T" },
        { type: "radio", label: "Efectivo y ", value: "M" },
        { type: "radio", label: "Otros", value: "O" }]
      , buttons: [{
        text: "Aceptar", handler: radio => {
          if (radio == "T") {
            this.navCtrl.push(PaypalPage);
            

            this.cobrarTicketMetodo(0, radio, false);
          } else {

            let alerta = this.alertCtrl.create({
              title: "Cantidad", inputs: [{ placeholder: "Cantidad", type: "number", name: "cantidad" }],
              buttons: [{
                text: "Cobrar", handler: datos => {
                  this.cobrarTicketMetodo(datos, radio, true);
                }
              }]
            });
            alerta.present();

          }
        }
      }, { text: "Cancelar" }]
    });
    //tipoPago.present();


  }


  public cobrarTicketMetodo(datos, radio, mostrarMonto) {
    let cantidad = 0;



    if (mostrarMonto) {
      cantidad = datos.cantidad;
    }

    let cantidadPagar = this.total;
    if (this.promociones.length > 0) {
      cantidadPagar = this.totalNeto;
    }

    if (this.cortesia != 0) {
      cantidadPagar = this.totalPagar;
    }


    if (this.iva == true) {
      cantidadPagar = ((cantidadPagar * 16) / 100) + cantidadPagar;
    }

    if (((Number(cantidad) >= Number(cantidadPagar)) || radio == 'M') || !mostrarMonto) {

      let arregloPromocionEnviar: any = [];
      for (let item of this.promociones) {
        let id = item.id_promocion;
        let nombre = item.nombre;
        let precio = item.precio * item.totalPromocion;
        let cantidad = item.totalPromocion;
        let arregloProductosPromocion: any = [];
        for (let i of item.productos) {
          let id_producto = i.id;
          let nombre = i.nombre;
          let cantidad = i.cantidad;
          let total = i.total;

          let objProductos = {
            id_producto: id_producto,
            nombre: nombre,
            cantidad: cantidad,
            total: total
          };

          arregloProductosPromocion.push(objProductos);
        }

        let objPromocion = {
          id: id,
          nombre: nombre,
          precio: precio,
          cantidad: cantidad,
          listaProductos: arregloProductosPromocion
        };

        arregloPromocionEnviar.push(objPromocion);
      }

      

      let totalLocal = this.total;
      if (this.cortesia != 0) {
        totalLocal = this.totalPagar;
      }

      let objEnviar;
      if (radio == 'M') {
        objEnviar = {
          idTicket: this.id_ticket,
          total: totalLocal,
          tipoPago: 'E',
          promociones: arregloPromocionEnviar,
          iva: 0,
          tarjeta: (totalLocal - cantidad),
          tipoPropina:datos.tipoPropina,
          propina:datos.propina
        };
      } else {
        objEnviar = {
          idTicket: this.id_ticket,
          total: totalLocal,
          tipoPago: radio,
          promociones: arregloPromocionEnviar,
          iva: 0,
          tipoPropina:datos.tipoPropina,
          propina:datos.propina
        };
      }

      if (this.iva == true) {
        if (this.cortesia != 0) {

          if (this.cortesia == 1) {
            objEnviar.iva = ((this.total - this.descontar_ticket) * 16) / 100;
          } else if (this.cortesia == 2) {
            objEnviar.iva = ((this.total - (this.total * this.descontar_ticket) / 100) * 16) / 100;
          } else {
            objEnviar.iva = 0;
          }

        } else {
          objEnviar.iva = (this.total * 16) / 100;

        }
      }

      this.ticketsPrd.cobrarTicket(objEnviar).subscribe(datos => {
        let toas = this.toasCtrl.create({ message: datos.respuesta, duration: 1000 });
        toas.present();
        cantidad = radio == "M" ? 0 : cantidad;
        this.viewCtrl.dismiss({ id_ticket: objEnviar.idTicket, billete: cantidad });
      });

    } else {
      let alerta = this.alertCtrl.create({
        title: "Monto incorrecto", subTitle: "El monto ingresado debe ser mayor o igual al monto gastado",
        buttons: [{ text: "Aceptar", handler: () => { } }]
      });
      alerta.present();
    }
  }


}
