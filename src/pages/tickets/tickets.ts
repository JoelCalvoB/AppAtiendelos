import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { Vibration } from '@ionic-native/vibration';
import { SMS } from '@ionic-native/sms';
import { CurrencyPipe } from '@angular/common';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ImpresionesProvider } from '../../providers/impresiones/impresiones';
import { GlobalesProvider } from '../../providers/globales/globales';
/**
 * Generated class for the TicketsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {

  private billete;
  private arreglo: any = [];
  private total = 0;
  private folio = 0;
  private nombre_ticket = "";
  private id_mesa = "";
  private id_token = "";
  private nombre_sucursal = "";
  private promociones: any = [];
  private totalNeto = 0;
  private cortesia = 0;
  private descuento = 0;

  private mensaje: boolean = false;
  private imprimir;
  private codigos;
  private nombre_mesa:string = "";
  private iva_dinero = 0 ;
  private iva:boolean = false;
  private ivarecupera:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ticketsPrd: TicketsProvider,
    private sucursalPrd: SucursalesProvider,
    private Vibrador: Vibration,
    private alerta: AlertController,
    private toasCtrl: ToastController,
    private sms: SMS,
    private currency: CurrencyPipe,
    private google: GooglePlus,
    public http: HttpClient,
    private usuariosPrd: UsuariosProvider,
    private bt: BluetoothSerial,
    private loadCtrl: LoadingController,
    private impresorasPrd: ImpresionesProvider,
    private globales: GlobalesProvider,
    private platform: Platform) {
    this.billete = navParams.get("billete");
    let id_ticket = navParams.get("id_ticket");
    let bandera_tipo = navParams.get ("bandera_tipo");

    let config = this.globales.getConfiguraciones();
    
    if(config != undefined && config != null){
      this.iva = config.iva;
      this.ivarecupera = config.ivarecupera;
    }

    this.iva = this.iva == undefined ? false : this.iva;
    this.ivarecupera = this.ivarecupera == undefined ? false : this.ivarecupera;


  if (bandera_tipo==true)
  {
    
    ticketsPrd.getTicketsDetalleAgrupadoTicketFinalEspecial(id_ticket).subscribe(resultado => {
      
      let datos = resultado.resultado;
      this.promociones = resultado.promociones;
      this.arreglo = datos;
      let totalCortesia = 0;
      this.imprimir = resultado;
      
      for (let i of datos) {
        this.folio = i.id_folio;
        this.id_mesa = i.id_mesa;
        this.cortesia = i.cortesia_ticket;
        this.descuento = i.descuento_ticket;
        this.mensaje = i.cortesia_ticket != 0;
        totalCortesia = i.total;
        this.nombre_mesa = i.nombre_ticket;
        this.iva_dinero = i.iva;
        this.nombre_ticket = i.nombre_ticket;
      }

      
     

      let totalPromociones = 0;
      let totalProductosPromociones = 0;
      for (let item of this.promociones) {
        totalPromociones = totalPromociones + item.total;

        for (let producto of item.productos) {
          totalProductosPromociones = totalProductosPromociones + producto.total;
        }
      }

      this.totalNeto = this.total - totalProductosPromociones;
      this.totalNeto = this.totalNeto + totalPromociones;


      this.total = totalCortesia;

    });
  }
  else
  {
    

    ticketsPrd.getTicketsDetalleAgrupadoTicketFinal(id_ticket).subscribe(resultado => {
      
      let datos = resultado.resultado;
      this.promociones = resultado.promociones;
      this.arreglo = datos;
      let totalCortesia = 0;
      this.imprimir = resultado;
      
      for (let i of datos) {
        this.folio = i.id_folio;
        this.id_mesa = i.id_mesa;
        this.cortesia = i.cortesia_ticket;
        this.descuento = i.descuento_ticket;
        this.mensaje = i.cortesia_ticket != 0;
        totalCortesia = i.total;
        this.nombre_mesa = i.nombre_ticket;
        this.iva_dinero = i.iva;
        this.nombre_ticket = i.nombre_ticket
      }

      let totalPromociones = 0;
      let totalProductosPromociones = 0;
      for (let item of this.promociones) {
        totalPromociones = totalPromociones + item.total;

        for (let producto of item.productos) {
          totalProductosPromociones = totalProductosPromociones + producto.total;
        }
      }

      this.totalNeto = this.total - totalProductosPromociones;
      this.totalNeto = this.totalNeto + totalPromociones;


      this.total = totalCortesia;

    });

    let id_sucursal = usuariosPrd.getSucursal();
    this.sucursalPrd.getEspecifico(id_sucursal).subscribe(datos => {
      this.nombre_sucursal = datos.nombre;
    });

    if (this.billete) {
      this.Vibrador.vibrate(1000);
    }
  }
}

  ionViewDidLoad() {
    
  }

  public cerrar1() {
    this.navCtrl.pop();
  }

  public enviar(): any {
    let opciones = this.alerta.create({
      title: "Modo de envío",
      message: "Seleccione la manera que se enviara el ticket",
      inputs: [
        {
          type: "radio",
          value: "3",
          name: "impresora",
          label: "Impresora",
          checked: true
        },{
        type: "radio",
        value: "1",
        name: "email",
        label: "Correo Electrónico"
      },
      {
        type: "radio",
        value: "2",
        name: "sms",
        label: "Mensaje de Texto"
      }], buttons: [{
        text: "Aceptar", handler: datos => {

          let mensaje = "";

          let sucursal = "Sucursal: " + this.nombre_sucursal + "\n";
          let cuenta = "N° Folio: " + this.folio + "\n";
          let lineas = "-----------------------\n";
          let lineas2 = "Productos consumidos\n";
          let productos = "";
          let total = "Total: " + this.currency.transform(this.total);
          for (let item of this.arreglo) {
            let cantidad = item.cantidad;
            let nombre = item.nombre;
            let unitario = this.currency.transform(item.unitario);
            let precioTotalCantidad = this.currency.transform(item.precio_total);


            productos = productos + cantidad + " " + nombre + " " + precioTotalCantidad + "\n";
          }

          mensaje = sucursal + cuenta + lineas + lineas2 + productos + lineas + total + "\n";


          if (datos == 1) {//Este es para envíar el ticket por correo electrónico de gmail...
            this.google.login({
              scopes: 'https://www.googleapis.com/auth/gmail.send https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify'
            })
              .then(res => {
                
                
                let alert = this.alerta.create({
                  title: "Correo Electrónico", message: "Ingresa el correo electrónico",
                  inputs: [{ type: "text", placeholder: "Correo Eletrónico", name: "correo" }],
                  buttons: [{
                    text: "Aceptar", handler: parametro => {
                      let id_token = res.accessToken;
                      const httpOptions = {
                        headers: new HttpHeaders({
                          'Content-Type': 'message/rfc822',
                          'Authorization': 'Bearer ' + id_token
                        })
                      };


                      let usuarioEnviar = res.email;
                      let userId = res.userId;
                      let direccion = "https://www.googleapis.com/upload/gmail/v1/users/" + userId + "/messages/send?uploadType=multipart";

                      let ms1 = "From: AppMovil <" + usuarioEnviar + ">\n";
                      ms1 = ms1 + "to: " + parametro.correo + "\n";
                      ms1 = ms1 + "Subject: Ticket de compra AppsMovil\n";
                      ms1 = ms1 + "MIME-Version: 1.0\n";
                      ms1 = ms1 + "Content-Type: multipart/mixed;\n";
                      ms1 = ms1 + "        boundary=\"limite1\"\n\n";
                      ms1 = ms1 + "En esta sección se prepara el mensaje\n\n";
                      ms1 = ms1 + "--limite1\n";
                      ms1 = ms1 + "Content-Type: text/plain\n\n";
                      ms1 = ms1 + mensaje;

                      this.http.post(direccion, ms1, httpOptions).subscribe(datos => {
                        let toas = this.toasCtrl.create({ message: "Mensaje envíado correctamente", duration: 1500 });
                        toas.present();
                      }, error => {
                        let toas = this.alerta.create({ message: JSON.stringify(error) });
                        toas.present();
                      });
                    }
                  }]
                });
                alert.present();


              })
              .catch(err => {
               
                this.navCtrl.pop();
              });
          } else if (datos == 2) {//Este es para envíar el ticket por medio de un mensaje sms
            let ventanaCelular = this.alerta.create({
              title: "Aviso",
              message: "Número de celular",
              inputs: [{ type: "number", placeholder: "Número de celular", name: "celular" }],
              buttons: [{
                text: "Enviar", handler: datos => {
                  if (datos.celular.length == 10) {
                    this.sms.send(datos.celular, mensaje);
                    let toas = this.toasCtrl.create({ message: "Mensaje enviado correctamente", duration: 1500 });
                    this.navCtrl.pop();
                    toas.present();
                  } else {
                    let toas = this.toasCtrl.create({ message: "Error en número de celular, intente de nuevo", duration: 1500 });
                    toas.present();
                  }
                }
              }]
            });
            ventanaCelular.present();
          } else {
            this.imprimirTicket();
          }
        }
      }]
    });


    opciones.present();
  }

  public imprimirTicket() {
    this.codigos = this.impresorasPrd.getCodigosImpresora();
    let loading = this.loadCtrl.create({ content: "Imprimiendo" });
    loading.present();

    let resultado = this.imprimir;

    let datos = resultado.resultado;
    let promocionesArreglo = resultado.promociones;

    let folio = 0;


    let nombreRestaurante = "";
    let impresora80;
    let iva;
    let ivarecupera;

    let configura = this.globales.getConfiguraciones();
    if ( configura!= undefined && configura != null) {
        nombreRestaurante = configura.nombre;
        impresora80 = configura.impresora80;
        iva = configura.iva;
        ivarecupera = configura.ivarecupera;
    }

    impresora80 = impresora80 == undefined ? false : impresora80;
    iva = iva == undefined ? false : iva;
    ivarecupera = ivarecupera == undefined ? false : ivarecupera;

    if (datos.length > 0) {
      let productosaux = "";
      let f = new Date();
      this.total = 0;
      for (let i of datos) {
        this.total = this.total + i.precio_total;
        let cantidad = i.cantidad;
        let nombre = i.nombre;
        let unitario = this.currency.transform(i.unitario);
        let precioTotalCantidad = this.currency.transform(i.precio_total);

        folio = i.id_folio;
        let auxLetrero = "";

        if (i.cortesia == 1 || i.cortesia == 2) {
          auxLetrero = "\n\t\tDESCUENTO";

        } else {
          auxLetrero = `\n\t\t${unitario}`
        }



        productosaux = productosaux + `${cantidad} ` + nombre + `${auxLetrero}\t${precioTotalCantidad}\n`
      }

      let mensaje = "";
      //Apartado del descuento
      let cortesia = datos[0].cortesia_ticket;
      let descuento = datos[0].descuento_ticket;

      

      let auxmensaje = "";
      let totalDescuento = 0;

      if (cortesia == 1) {
        totalDescuento = this.total - descuento;
        auxmensaje = "Descuento al ticket en efectivo por: " + this.currency.transform(descuento) + "\n";
        auxmensaje = auxmensaje + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + this.codigos.TEXT_FORMAT.TXT_2HEIGHT + "\nTotal a pagar: " + this.currency.transform(totalDescuento) + "\n";
      } else if (cortesia == 2) {
        totalDescuento = this.total - ((descuento * this.total) / 100);
        auxmensaje = "Descuento al ticket por porcentaje del: " + descuento + "%\n";
        auxmensaje = auxmensaje + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + this.codigos.TEXT_FORMAT.TXT_2HEIGHT + "\nTotal a pagar: " + this.currency.transform(totalDescuento) + "\n";
      } else if (cortesia == 3) {
        auxmensaje = "Ticket por cortesía\n";
        auxmensaje = auxmensaje + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + this.codigos.TEXT_FORMAT.TXT_2HEIGHT + "\nTotal a pagar: " + this.currency.transform(0) + "\n";
      }



      let sucursal = this.codigos.TEXT_FORMAT.TXT_ALIGN_CT + this.codigos.TEXT_FORMAT.TXT_4SQUARE + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "TICKET DE COMPRA" + this.codigos.LF + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "NOMBRE DEL RESTAURANTE" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + "\n\n" + this.codigos.TEXT_FORMAT.TXT_ALIGN_LT + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Sucursal:" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.nombre_sucursal + this.codigos.LF;
      let fecha = this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Fecha:" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
      let mesero = this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "\tMesero:" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.usuariosPrd.getNombreUsuario() + this.codigos.LF;
      let cuenta = this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Folio:" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + folio + "\t";
      let mesa = this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Mesa:" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.nombre_ticket + this.codigos.LF + this.codigos.LF + this.codigos.TEXT_FORMAT.TXT_ALIGN_CT + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "PRODUCTOS CONSUMIDOS" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.codigos.LF + this.codigos.LF;
      let productos = this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_FONT_B + this.codigos.TEXT_FORMAT.TXT_ALIGN_LT + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Cant. | Nombre\t| Precio\t| Importe" + this.codigos.LF + "______________________________________" + this.codigos.LF + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + productosaux + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "\n______________________________________\n";
      let total = "";
      if (iva == true) {
          total = this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "Subtotal:" + this.currency.transform(this.total) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n" +
              this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "IVA:" + this.currency.transform((16 * this.total) / 100) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n" +
              this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "TOTAL:" + this.currency.transform(((16 * this.total) / 100) + this.total) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n";
      } else if (ivarecupera == true) {
          total = this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "Subtotal:" + this.currency.transform((this.total * 100) / 116) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n" +
              this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "IVA:" + this.currency.transform(this.total-((100 * this.total) / 116)) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n" +
              this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "TOTAL:" + this.currency.transform(this.total) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n";
      } else {

          total = this.codigos.TEXT_FORMAT.TXT_2HEIGHT + (impresora80 == true ? "\t\t\t" : "\t\t") + this.codigos.TEXT_FORMAT.TXT_UNDERL_ON + "Total:" + this.currency.transform(this.total) + this.codigos.TEXT_FORMAT.TXT_NORMAL + this.codigos.TEXT_FORMAT.TXT_UNDERL_OFF + "\n";
      }
      let promociones = "\n";
      let descuento_ticket = this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + auxmensaje + "\n";
      let final = this.codigos.TEXT_FORMAT.TXT_ALIGN_CT + "GRACIAS POR SU PREFERENCIA\n\n\n-------------------------------\n\n";

      if (promocionesArreglo != undefined) {
        if (promocionesArreglo.length != 0) {
          let totalPromociones = 0;
          let totalProductos = 0;
          let totalNeto = 0;
          for (let promocionItem of promocionesArreglo) {
            promociones = promociones + this.codigos.TEXT_FORMAT.TXT_ALIGN_CT + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "PROMOCIONES" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.codigos.TEXT_FORMAT.TXT_ALIGN_LT + this.codigos.LF;
            let productospromociones = promocionItem.productos;
            let anexaMensaje = "";
            totalPromociones = totalPromociones + (promocionItem.totalPromocion * promocionItem.precio);

            for (let auxpromo of productospromociones) {
              anexaMensaje = anexaMensaje + auxpromo.nombre + this.codigos.LF;
              anexaMensaje = anexaMensaje + `\n\t\t${auxpromo.cantidad}\t${this.currency.transform(auxpromo.total)}\n`
              totalProductos = totalProductos + auxpromo.total;
            }

            totalNeto = this.total - totalProductos;
            totalNeto = totalNeto + totalPromociones;

            promociones = promociones + anexaMensaje;
            promociones = promociones + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Aplicando descuento\n" + this.codigos.TEXT_FORMAT.TXT_BOLD_OFF;
            promociones = promociones + promocionItem.totalPromocion + " " + promocionItem.nombre + "\n\t\t" + this.currency.transform(promocionItem.precio) + "\t" + this.currency.transform(promocionItem.precio * promocionItem.totalPromocion) + this.codigos.LF + "______________________________________\n";
          }
          promociones = promociones + this.codigos.TEXT_FORMAT.TXT_BOLD_ON + "Total a pagar:\t" + this.currency.transform(totalNeto) + "\n\n\n"
        }
      }

      mensaje = sucursal + fecha + mesero + cuenta + mesa + productos + total + promociones + descuento_ticket + final;
 

      

      let wifi: boolean = false;
      let impresoraCajero:boolean = false;
      if (configura != undefined || configura != null) {
        wifi = configura.esImpresoraWifi;
        impresoraCajero = configura.impresoraCajero;
      }
      wifi = wifi == undefined ? false : wifi;
      impresoraCajero = impresoraCajero == undefined ? false:impresoraCajero;

    
 

      if(impresoraCajero == true){
        if(wifi == false){
          if (this.platform.is('cordova')) {
            this.globales.conectarCajero(mensaje).then(datos =>{
              loading.dismiss();
            },err =>{
              loading.dismiss();
            });
          }
        }else{
          this.impresorasPrd.enviarWifiCajero(mensaje).subscribe(datos =>{
            loading.dismiss();
          },error =>{
            loading.dismiss();
            let toast = this.toasCtrl.create({message:"Error al imprimir el tikcet",duration:1500});
            toast.present();
          });
        }

      }else{
        let toast = this.toasCtrl.create({message:"No hay impresora configurada",duration:1500});
        toast.present();
        loading.dismiss();
      }

    } else {
      loading.dismiss();
      let toast = this.toasCtrl.create({ message: "No hay elementos para imprimir el ticket", duration: 1500 });
      toast.present();
    }
  }

}
