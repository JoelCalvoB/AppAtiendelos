import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, FabContainer, ToastController, LoadingController, Platform, ModalController } from 'ionic-angular';
import { CortecajaProvider } from '../../providers/cortecaja/cortecaja';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { CajaEspecialPage } from '../caja-especial/caja-especial';
import { ImpresionesProvider } from '../../providers/impresiones/impresiones';
import { CurrencyPipe } from '@angular/common';
import { GlobalesProvider } from '../../providers/globales/globales';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BilletesPage } from '../billetes/billetes';


/**
 * Generated class for the CajaCortePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-caja-corte',
  templateUrl: 'caja-corte.html',
})
export class CajaCortePage {

  public fecha;
  public efectivo: any = [];
  public salidas: any = [];
  public totales = 0;
  public totalSalida = 0;
  public id_sucursal;
  public id_usuario;
  public aparecer = false;
  public cortecaja;
  public reloadicon: boolean = false;
  public entradas = [];
  public totalEntradas = 0;
  public reloadiconEntrada: boolean = false;
  public totalEfectivo = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cortePrd: CortecajaProvider,
    private usuariosPrd: UsuariosProvider, private alertCtrl: AlertController, private toastCtrl: ToastController,
    private loadCtrl: LoadingController, private impPrd: ImpresionesProvider, private currency: CurrencyPipe, private platform: Platform, private globales: GlobalesProvider,
    private google: GooglePlus,public http: HttpClient,private modal:ModalController) {
    
      if(!this.usuariosPrd.getFree()){
        this.id_sucursal = usuariosPrd.getSucursal();
    this.id_usuario = usuariosPrd.getIdUsuario();


    this.cortecaja = navParams.get("obj");
    this.buscar();
      }else{
        
      }
  }

  ionViewDidLoad() {
    
  }


  public buscar() {

    if (!this.cortecaja.cerrada) {
      this.cortecajaSinCerrar();
    } else {
      this.cortecajaCerrada();
    }

  }

  public cortecajaCerrada() {
    let obj = {
      idsucursal: this.id_sucursal,
      id: this.cortecaja.id
    }

    this.aparecer = true;
    this.cortePrd.totalCortecajaConcorte(obj).subscribe(datos => {
    
      this.efectivo = datos;
      let total = 0;
      let itarjeta = 0;
      let booltarjeta:boolean = false;
      for (let item of this.efectivo) {
 
        switch (item.tipo_pago) {
          case 'E':
            item.tipo_pago = 'Efectivo';
            this.totalEfectivo = this.totalEfectivo + item.total - item.tarjeta;
            itarjeta = item.tarjeta;
            break;
          case 'C':
            item.tipo_pago = 'Cortesia';
            break;
          case 'T':
            item.tipo_pago = 'Tarjeta credito/debito';
            item.total = item.total + itarjeta;
            booltarjeta = true;
            break;
          default:
            item.tipo_pago = 'Otros';
            break;
        }
        total = total + item.total;
      }
      this.totales = total;

      if(!booltarjeta){
          this.efectivo.push({
            tipo_pago:'Tarjeta credito/debito',
            total:itarjeta,
            tarjeta:0
          });
      }

      let obj2 = { tipo_pago: "TOTAL", total: total,tarjeta:0 };
      this.efectivo.push(obj2);
      this.cortePrd.getGastosConCorte(obj).subscribe(cortegastos => {
        this.salidas = cortegastos;
        this.totalSalida = 0;
        for (let i of this.salidas) {
          i.dinero = i.total;
          this.totalSalida = this.totalSalida + Number(i.dinero);
        }
      });

      this.cortePrd.getEntradasConCorte(obj).subscribe(corteentradas => {
        this.entradas = corteentradas;
        this.totalEntradas = 0;
        for (let i of this.entradas) {
          i.dinero = i.total;
          this.totalEntradas = this.totalEntradas + Number(i.dinero);
        }
      });

    });
  }


  public cortecajaSinCerrar() {
    let obj = {
      idsucursal: this.usuariosPrd.getSucursal()
    };


    this.aparecer = true;
    this.cortePrd.totalCortecajaSincorte(obj).subscribe(datos => {

      this.efectivo = datos;
      let total = 0;
      let itarjeta = 0;
      let booltarjeta:boolean = false;
      for (let item of this.efectivo) {

        switch (item.tipo_pago) {
          case 'E':
            item.tipo_pago = 'Efectivo';
            this.totalEfectivo = this.totalEfectivo + item.total - item.tarjeta;
            itarjeta = item.tarjeta;
            break;
          case 'C':
            item.tipo_pago = 'Cortesia';
            break;
          case 'T':
            item.tipo_pago = 'Tarjeta credito/debito';
            item.total = item.total + itarjeta;
            booltarjeta = true;
            break;
          default:
            item.tipo_pago = 'Otros';
            break;
        }
        total = total + item.total;
      }
      this.totales = total;

      if(!booltarjeta){
          this.efectivo.push({
            tipo_pago:'Tarjeta credito/debito',
            total:itarjeta,
            tarjeta:0
          });
      }

      let obj2 = { tipo_pago: "TOTAL", total: total,tarjeta:0 };
      this.efectivo.push(obj2);
      this.cortePrd.getGastosSinCorte(obj).subscribe(cortegastos => {
        this.salidas = cortegastos;
        this.totalSalida = 0;
        for (let i of this.salidas) {
          i.dinero = i.total;
          this.totalSalida = this.totalSalida + Number(i.dinero);
        }
      });

      this.cortePrd.getEntradasSinCorte(obj).subscribe(corteentradas => {
        this.entradas = corteentradas;
        this.totalEntradas = 0;
        for (let i of this.entradas) {
          i.dinero = i.total;
          this.totalEntradas = this.totalEntradas + Number(i.dinero);
        }
      });
    });

  }


  public addSalidas() {
    let alerta = this.alertCtrl.create({

      subTitle: "Agregando salidas de efectivo",
      inputs: [{
        type: "text",
        name: "nombre",
        placeholder: "Nombre gasto", label: "Nombre salida"

      }, {
        type: "number",
        name: "dinero",
        placeholder: "Cantidad", label: "Cantidad"

      }], buttons: [{
        text: "Aceptar", handler: datos => {
          this.salidas.push(datos);
          this.totalSalida = 0;
          for (let i of this.salidas) {
            this.totalSalida = this.totalSalida + Number(i.dinero);
          }
        }
      }]
    });
    alerta.present();
  }


  public addEntradas() {
    let alerta = this.alertCtrl.create({

      subTitle: "Agregando entradas de efectivo",
      inputs: [{
        type: "text",
        name: "nombre",
        placeholder: "Nombre entrada", label: "Nombre entrada"

      }, {
        type: "number",
        name: "dinero",
        placeholder: "Cantidad", label: "Cantidad"

      }], buttons: [{
        text: "Aceptar", handler: datos => {
          this.entradas.push(datos);
          this.totalEntradas = 0;
          for (let i of this.entradas) {
            this.totalEntradas = this.totalEntradas + Number(i.dinero);
          }
        }
      }]
    });
    alerta.present();
  }

  public realizarGastos() {
    if (this.salidas.length != 0) {
      this.reloadicon = true;
      for (let item of this.salidas) {
        item.idUsuario = this.id_usuario;
        item.idSucursal = this.id_sucursal;
        item.fechaAux = this.fecha;
        item.total = item.dinero;
      }
      this.cortePrd.addGastos(this.salidas).subscribe(realizado => {
        let toast = this.toastCtrl.create({ message: "Gastos capturados", duration: 1500 });
        toast.present();
        this.reloadicon = false;
      }, err => {
        this.reloadicon = false;
      });
    }


  }

  public realizarEntrada() {
    if (this.entradas.length != 0) {
      this.reloadiconEntrada = true;
      for (let item of this.entradas) {
        item.idUsuario = this.id_usuario;
        item.idSucursal = this.id_sucursal;
        item.fechaAux = this.fecha;
        item.total = item.dinero;
      }
      this.cortePrd.addEntradas(this.entradas).subscribe(realizado => {
        let toast = this.toastCtrl.create({ message: "Entradas capturadas", duration: 1500 });
        toast.present();
        this.reloadiconEntrada = false;
      }, err => {
        this.reloadiconEntrada = false;
      });
    }


  }

  public verCorte() {
    let alerta = this.alertCtrl.create({
      message: "Imprimir reporte",
      subTitle: "Reporte",
      inputs: [{
        type: "radio",
        value: "1",
        name: "impresora",
        label: "Impresora",
        checked: true
      }],
      buttons: [{
        text: "Aceptar",
        handler: datos => {
          if (datos == 1) {
          }
        }
      }]
    });
    alerta.present();
  }

  public actualizar(i) {

    let alerta = this.alertCtrl.create({

      subTitle: "Modificando Salida de efectivo",
      inputs: [{
        type: "text",
        name: "nombre",
        placeholder: "Nombre gasto", label: "Nombre salida",
        value: i.nombre

      }, {
        type: "number",
        name: "dinero",
        placeholder: "Cantidad", label: "Cantidad",
        value: i.dinero

      }], buttons: [{
        text: "Aceptar", handler: datos => {
          i.nombre = datos.nombre;
          i.dinero = datos.dinero;
          this.totalSalida = 0;
          for (let i of this.salidas) {
            this.totalSalida = this.totalSalida + Number(i.dinero);
          }
        }
      }]
    });
    alerta.present();
  }

  public actualizarEntrada(i) {

    let alerta = this.alertCtrl.create({

      subTitle: "Modificando Entrada de efectivo",
      inputs: [{
        type: "text",
        name: "nombre",
        placeholder: "Nombre entrada", label: "Nombre entrada",
        value: i.nombre

      }, {
        type: "number",
        name: "dinero",
        placeholder: "Cantidad", label: "Cantidad",
        value: i.dinero

      }], buttons: [{
        text: "Aceptar", handler: datos => {
          i.nombre = datos.nombre;
          i.dinero = datos.dinero;
          this.totalEntradas = 0;
          for (let i of this.entradas) {
            this.totalEntradas = this.totalEntradas + Number(i.dinero);
          }
        }
      }]
    });
    alerta.present();
  }


  public corte() {
    let mensaje = this.alertCtrl.create({
      message: "¿Deseas realizar el corte de caja?",
      buttons: [{
        text: "Si", handler: () => {
          let load = this.loadCtrl.create({ content: "Realizando el corte de caja" });
          load.present();
          this.cortePrd.realizarcorte(this.cortecaja).subscribe(respuesta => {
            this.imprimiendocorte();
            this.cortecaja.cerrada = true;
            load.dismiss();
            let toast = this.toastCtrl.create({ message: "Corte de caja realizada", duration: 1500 });
            toast.present();
            this.navCtrl.pop();
          }, error => {
            load.dismiss();
            let toast = this.toastCtrl.create({ message: "Error al realizar el corte", duration: 1500 });
            toast.present();
          });
        }
      }, "No"]
    });

    mensaje.present();
  }

  public imprimiendocorte() {
    
    

    let mensaje = this.formarMensajeImpresora();
    if (this.cortecaja.cerrada == true) {

      let alerta = this.alertCtrl.create({
        subTitle: "Elegir opcion", message: "Metodo de visualizacion", inputs: [
          { type: "radio", value: "1", checked: true, label: "Correo electronico" },
          { type: "radio", value: "2",  label: "Impresora" }
        ],buttons:[{text:"Aceptar",handler:datos =>{
          mensaje = this.formarMensaje();
          if(datos == 1){

            this.google.login({
              scopes: 'https://www.googleapis.com/auth/gmail.send https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify'
            })
              .then(res => {
 
                let alert = this.alertCtrl.create({
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
                        let toas = this.toastCtrl.create({ message: "Mensaje envíado correctamente", duration: 1500 });
                        toas.present();
                      }, error => {
                        let toas = this.alertCtrl.create({ message: JSON.stringify(error) });
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

          }else if(datos == 2){
            let configura = this.globales.getConfiguraciones();
            let wifi: boolean = false;
      
            if (configura != undefined || configura != null) {
              wifi = configura.esImpresoraWifi;
            }
            wifi = wifi == undefined ? false : wifi;
      
      
            if (wifi == true) {
              this.impPrd.enviarWifiCajero(mensaje).subscribe(datos => {
                let mensaje = this.toastCtrl.create({ message: "Ticket enviado correctamente", duration: 1500 });
                mensaje.present();
              }, error => {
                let mensaje = this.toastCtrl.create({ message: "Error a enviar a impresora", duration: 1500 });
                mensaje.present();
              });
            } else {
              if (this.platform.is('cordova')) {
                this.globales.conectarCajero(mensaje);
              }
            }

          }
        }}]
      });

      alerta.present();

    } else {

      
      let configura = this.globales.getConfiguraciones();
      let wifi: boolean = false;

      if (configura != undefined || configura != null) {
        wifi = configura.esImpresoraWifi;
      }
      wifi = wifi == undefined ? false : wifi;


      if (wifi == true) {
        this.impPrd.enviarWifiCajero(mensaje).subscribe(datos => {
          let mensaje = this.toastCtrl.create({ message: "Ticket enviado correctamente", duration: 1500 });
          mensaje.present();
        }, error => {
          let mensaje = this.toastCtrl.create({ message: "Error a enviar a impresora", duration: 1500 });
          mensaje.present();
        });
      } else {
        if (this.platform.is('cordova')) {
          this.globales.conectarCajero(mensaje);
        }
      }

    }


  }

  public formarMensajeImpresora(){
    let codigos = this.impPrd.codigos;
    let ventas = codigos.TEXT_FORMAT.TXT_BOLD_ON + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_ALIGN_CT + "Ventas" + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF;
    for (let item of this.efectivo) {
      ventas = ventas + codigos.TEXT_FORMAT.TXT_BOLD_ON + item.tipo_pago + ": " + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.currency.transform(item.total - item.tarjeta) + codigos.LF
    }


    let salidas = codigos.TEXT_FORMAT.TXT_BOLD_ON + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_ALIGN_CT + "Salidas" + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF;
    for (let item of this.salidas) {
      salidas = salidas + codigos.TEXT_FORMAT.TXT_BOLD_ON + item.nombre + ": " + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.currency.transform(item.dinero) + codigos.LF
    }

    salidas = salidas + codigos.TEXT_FORMAT.TXT_UNDERL_ON + codigos.TEXT_FORMAT.TXT_BOLD_ON + "Total:" + this.totalSalida + codigos.TEXT_FORMAT.TXT_UNDERL_OFF + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF

    let entradas = codigos.TEXT_FORMAT.TXT_BOLD_ON + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_ALIGN_CT + "Entradas" + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF;
    for (let item of this.entradas) {
      entradas = entradas + codigos.TEXT_FORMAT.TXT_BOLD_ON + item.nombre + ": " + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.currency.transform(item.dinero) + codigos.LF
    }

    entradas = entradas + codigos.TEXT_FORMAT.TXT_UNDERL_ON + codigos.TEXT_FORMAT.TXT_BOLD_ON + "Total:" + this.totalEntradas + codigos.TEXT_FORMAT.TXT_UNDERL_OFF + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF

    let mensaje = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "CORTE DE CAJA" + codigos.LF + codigos.TEXT_FORMAT.TXT_NORMAL +
      "Fecha de corte" + codigos.LF + new Date().toDateString() + codigos.LF + "Fondo:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.currency.transform(this.cortecaja.efectivo_apertura) + codigos.LF +
      codigos.TEXT_FORMAT.TXT_BOLD_ON + "Caja: " + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.currency.transform((this.cortecaja.efectivo_apertura + this.totalEntradas + this.totalEfectivo) - this.totalSalida) + codigos.LF +
      //codigos.TEXT_FORMAT.TXT_BOLD_ON+"Ventas totales: "+codigos.TEXT_FORMAT.TXT_BOLD_OFF+this.currency.transform(this.totales + this.totalEntradas + this.cortecaja.efectivo_apertura)+codigos.LF+
      //codigos.TEXT_FORMAT.TXT_BOLD_ON+"Ganancias:"+codigos.TEXT_FORMAT.TXT_BOLD_OFF+this.currency.transform( this.totales + this.totalEntradas + this.cortecaja.efectivo_apertura - this.totalSalida)+codigos.LF+
      "------------------------------" + codigos.LF + ventas +
      "------------------------------" + codigos.LF + salidas +
      "------------------------------" + codigos.LF + entradas +
      codigos.LF + codigos.LF + codigos.LF + "FIN CORTE DE CAJA" + codigos.EOL;



      return mensaje;

  }

  public formarMensaje(){
    let codigos = this.impPrd.codigos;
    let ventas = "Ventas\n";
    for (let item of this.efectivo) {
      ventas = ventas +  item.tipo_pago + ": " +  this.currency.transform(item.total - item.tarjeta) + "\n";
    }


    let salidas = "Salidas\n";
    for (let item of this.salidas) {
      salidas = salidas + item.nombre + ": " + this.currency.transform(item.dinero) + "\n";
    }

    salidas = salidas + "Total:" + this.totalSalida + "\n";

    let entradas = "Entradas\n";
    for (let item of this.entradas) {
      entradas = entradas + item.nombre + ": " + this.currency.transform(item.dinero) + "\n";
    }

    entradas = entradas + "Total:" + this.totalEntradas + "\n";

    let mensaje = "CORTE DE CAJA\n"+
      "Fecha de corte\n"+ new Date().toDateString() + "\n" + "Fondo:" +  this.currency.transform(this.cortecaja.efectivo_apertura) + "\n" +
      "Caja: " + this.currency.transform((this.cortecaja.efectivo_apertura + this.totalEntradas + this.totalEfectivo) - this.totalSalida) + "\n" +
      //codigos.TEXT_FORMAT.TXT_BOLD_ON+"Ventas totales: "+codigos.TEXT_FORMAT.TXT_BOLD_OFF+this.currency.transform(this.totales + this.totalEntradas + this.cortecaja.efectivo_apertura)+codigos.LF+
      //codigos.TEXT_FORMAT.TXT_BOLD_ON+"Ganancias:"+codigos.TEXT_FORMAT.TXT_BOLD_OFF+this.currency.transform( this.totales + this.totalEntradas + this.cortecaja.efectivo_apertura - this.totalSalida)+codigos.LF+
      "------------------------------\n" + ventas +
      "------------------------------\n" + salidas +
      "------------------------------\n" + entradas +
      "\n\n\n" + "FIN CORTE DE CAJA";
      return mensaje;

  }


  public abrirbilletes(){
    let modal = this.modal.create(BilletesPage,{caja:(this.cortecaja.efectivo_apertura + this.totalEntradas+this.totalEfectivo) - this.totalSalida },{
      cssClass:'margen_modal'
    });
    modal.present();
  }
}
