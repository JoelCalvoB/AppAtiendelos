import { Component, ɵConsole } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { Storage } from '@ionic/storage';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ImpresionesProvider } from '../../providers/impresiones/impresiones';


@Component({
  selector: 'page-cuentas-detalle-antesdeenviar',
  templateUrl: 'cuentas-detalle-antesdeenviar.html',
})
export class CuentasDetalleAntesdeenviarPage {

  public arreglo: any = [];
  public id_mesa;
  public id_ticket;
  public id_folio;
  public aux;
  public reemprimir: boolean = false;
  public reimprimirModel: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private alertCtrl: AlertController, private ticketPrd: TicketsProvider,
    private toasCtrl: ToastController, private plataforma: Platform, private storage: Storage, private usuariosPrd: UsuariosProvider,
    private globales: GlobalesProvider, private impresionesPrd: ImpresionesProvider, private configuraciones: GlobalesProvider,
    private loadCtrl: LoadingController) {
    this.aux = this.navParams.get("arreglo");
    this.id_mesa = this.navParams.get("id_mesa");
    this.id_ticket = this.navParams.get("id_ticket");
    this.id_folio = this.navParams.get("id_folio");



    for (let llave in this.aux) {
      let arregloAux = this.aux[llave];
      this.arreglo.push(arregloAux);
      console.log(this.aux);
    }

    this.reemprimir = false;
    for (let item1 of this.arreglo) {
      for (let item of item1) {
        if (item.servido == false) {
          this.reemprimir = false;
          break;
        }

        this.reemprimir = true;
      }
    }


  }

  ionViewDidLoad() {
  }

  public detenerPeticion: boolean = false;
  public cerrado: boolean = false;
  ionViewWillLeave() {
    this.detenerPeticion = true;
    this.toogle();


  }


  ionViewWillUnload() {

    this.ionViewWillLeave();
    this.toogle();
  }

  public verificacionTiempoReal() {


     if(!this.globales.isSemiOnline() && !this.usuariosPrd.getFree()){
      setTimeout(() => {

        if (!this.detenerPeticion) {
          this.ticketPrd.getTicketActivo(this.id_ticket).subscribe(datos => {
            this.verificacionTiempoReal();
          }, err => {
            if (!this.cerrado) {
              this.cerrado = true;
              this.viewCtrl.dismiss(true);
            }
          });
        }
      }, 1500);
     }

  }

  ionViewDidEnter() {
    this.verificacionTiempoReal();
  }





  public salir() {
    this.viewCtrl.dismiss();
  }

  public confirmar() {
    let alerta = this.alertCtrl.create({
      subTitle: "¿Deseas confirmar la orden?",
      message: "Confirmar la orden notificara a cocina y barra lo que se pidio",
      buttons: [{
        text: "sí", handler: () => {

          this.enviandoOrden();
        }
      }, "no"]
    });

    alerta.present();
  }


  public enviandoOrden() {


    let configuraciones = this.globales.getConfiguraciones();

    if (configuraciones == null || configuraciones == undefined) {
      this.globales.setConfiguraciones({});
      configuraciones = this.globales.getConfiguraciones();
    }

    let cocina = configuraciones.enviarCocina;
    let barra = configuraciones.enviarBarra;
    let cocinabarra = configuraciones.cocinabarra;

    cocina = cocina == undefined ? false : cocina;
    barra = barra == undefined ? false : barra;
    cocinabarra = cocinabarra == undefined ? false : cocinabarra;

    let id_sucursal = this.usuariosPrd.getSucursal();


    let arregloPedidosCopia = {};
    for (let llave in this.arreglo) {
console.log(this.arreglo);

      arregloPedidosCopia[llave] = [];
      for (let item of this.arreglo[llave]) {
        let obj = {};
        for (let llave2 in item) {
          obj[llave2] = item[llave2];
        }
        arregloPedidosCopia[llave].push(obj);
      }
    }

    let arregloEnviar = [];
    let reenvio = [];
    for (let x in arregloPedidosCopia) {
      for (let y of arregloPedidosCopia[x]) {
        if (y != null || y != undefined) {
          if (y.servido != true) {
            arregloEnviar.push(y);
          }
          reenvio.push(y);
        }
      }

    }

    for (let item of arregloEnviar) {
      item.ruta_imagen = "";
      if (item.notificacion == 1) {
        item.servido = cocina;
      } else if (item.notificacion == 2) {
        item.servido = barra;
      }
      else if (item.notificacion == 3) {
        item.servido = cocina;
      } else {
        item.servido = barra == true && cocina == true;
      }

      item.id_sucursal = id_sucursal;
    }

    let cargando = this.loadCtrl.create({ content: "Levantando orden espere" });
    cargando.present();
    if (arregloEnviar.length != 0 && this.reimprimirModel != true) {
      

      if(!this.configuraciones.isSemiOnline()){
        this.ticketPrd.insertDetalleLista(arregloEnviar).subscribe(datos => {

          //*Método para guardar en el storage */
          

          
          for (let llave in this.arreglo) {
            for (let item of this.arreglo[llave]) {
              item.servido = true;
            }
          }
  
  
          for (let llave in this.aux) {
            let arregloAux = this.aux[llave];
            for (let ll1 of arregloAux) {
              ll1.servido = true;
            }
          }
  
          this.storage.set(this.id_ticket, this.aux);
  
          //*Fin del método */
  
          this.imprimiendo(arregloEnviar, cargando, cocinabarra);
  
        }, error => {
          cargando.dismiss();
          let alerta = this.alertCtrl.create({ message: error.error.message, buttons: ["Entendido"] });
          alerta.present();
        });
      }else{

       
          //*Método para guardar en el storage */
          for (let llave in this.arreglo) {
            for (let item of this.arreglo[llave]) {
              item.servido = true;
            }
          }
  
  
          for (let llave in this.aux) {
            let arregloAux = this.aux[llave];
            for (let ll1 of arregloAux) {
              ll1.servido = true;
            }
          }
  
          this.storage.set(this.id_ticket, this.aux);
          
  
          //*Fin del método */
  
          this.imprimiendo(arregloEnviar, cargando, cocinabarra);
      }

    } else {
      cargando.dismiss();
      let alerta = this.alertCtrl.create({
        message: "¿Deseas reemprimir la orden?", title: "Reimpresión",
        buttons: [{
          text: "Sí", handler: () => {
            let mensaje = this.loadCtrl.create({ content: "Reimprimiendo ticket" });
            mensaje.present();
            if (this.reimprimirModel) {
              this.imprimiendo(arregloEnviar, mensaje, cocinabarra);
              for (let item1 of this.arreglo) {
                for (let item of item1) {
                  item.servido = true;
                }
              }
            } else {
              this.imprimiendo(reenvio, mensaje, cocinabarra);
            }
          }
        }, "No"]
      });
      alerta.present();

    }

  }


  public imprimiendo(arregloEnviar, cargando, cocinabarra) {



    let primertiempo = [];
    let segundoTiempo = [];
    let tercerTiempo = [];

    let arregloelse = [];
    for (let item of arregloEnviar) {
      if (item.tiempo != undefined) {
        if (item.tiempo.includes("PRIMER")) {
          primertiempo.push(item);
        } else if (item.tiempo.includes("SEGUNDO")) {
          segundoTiempo.push(item);
        } else if (item.tiempo.includes("TERCER")) {
          tercerTiempo.push(item);
        }else{
          arregloelse.push(item);
        }
      } else {
        arregloelse.push(item);
      }
    }

    let arregloTotal = [];
    for (let item of primertiempo) {
      arregloTotal.push(item);
    }
    for (let item of segundoTiempo) {
      arregloTotal.push(item);
    }
    for (let item of tercerTiempo) {
      arregloTotal.push(item);
    }
    for (let item of arregloelse) {
      arregloTotal.push(item);
    }

    arregloEnviar = arregloTotal;

  

    let codigos = this.impresionesPrd.getCodigosImpresora();

    let config = this.globales.getConfiguraciones();
    let impresora80;

    if (config != undefined && config != null) {

      impresora80 = config.impresora80;

    }

    impresora80 = impresora80 == undefined ? false : impresora80;

    let mensajeCocina;
    let mensajeBarra;
    let mensajeCocinaFria;

    let cocinaBool: boolean = false;
    let cocinaFriaBool: boolean = false;
    let barrabool: boolean = false;
    let ambos: boolean = false;



    let nombreOficial = this.id_mesa == undefined || this.id_mesa == null ? "" : this.id_mesa;
    nombreOficial = nombreOficial.replace("Cuentas", "");
    nombreOficial = nombreOficial.replace("unidas", "");
    nombreOficial = nombreOficial.replace(":", "");
    nombreOficial = nombreOficial.replace("Mesas", "");
    nombreOficial = nombreOficial.replace("Mesa", "");



    if (impresora80) {
      mensajeCocina = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "PEDIDOS COCINA" + codigos.LF + codigos.TEXT_FORMAT.TXT_2HEIGHT + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + "Fecha: " + this.horaDia() + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}  ${nombreOficial}\t ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + codigos.LF + "================================================" + codigos.LF;
      mensajeBarra = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "PEDIDOS BARRA" + codigos.LF + codigos.TEXT_FORMAT.TXT_2HEIGHT + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + "Fecha: " + this.horaDia() + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}  ${nombreOficial}\t ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + codigos.LF + "================================================" + codigos.LF;
      mensajeCocinaFria = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "PEDIDOS COCINA FRIA" + codigos.LF + codigos.TEXT_FORMAT.TXT_2HEIGHT + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + "Fecha: " + this.horaDia() + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}  ${nombreOficial}\t ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + codigos.LF + "================================================" + codigos.LF;



      for (let item of arregloEnviar) {
        let tiempo = item.tiempo == undefined ? "" : item.tiempo;



        if (item.notificacion == 1) {

          cocinaBool = true;
          let aux = "";
          aux = aux + `${item.cantidad}\t${item.nombre} (${tiempo}) ${codigos.LF}`;
          if (item.observaciones != "") {
            aux = aux + "\t(" + item.observaciones + ")" + codigos.LF;
          }
          mensajeCocina = mensajeCocina + aux;
        } else if (item.notificacion == 2) {
          barrabool = true;
          let aux = "";
          aux = aux + `${item.cantidad}\t${item.nombre} (${tiempo}) ${codigos.LF}`;
          if (item.observaciones != "") {
            aux = aux + "\t(" + item.observaciones + ")" + codigos.LF;
          }
          mensajeBarra = mensajeBarra + aux;

        } else if (item.notificacion == 3) {

          cocinaFriaBool = true;

          let aux = "";
          aux = aux + `${item.cantidad}\t${item.nombre} (${tiempo}) ${codigos.LF}`;
          if (item.observaciones != "") {
            aux = aux + "\t(" + item.observaciones + ")" + codigos.LF;
          }
          mensajeCocinaFria = mensajeCocinaFria + aux;
        } else if (item.notificacion == 4) {

          ambos = true;

          let aux = "";
          aux = aux + `${item.cantidad}\t${item.nombre} (${tiempo}) ${codigos.LF}`;
          if (item.observaciones != "") {
            aux = aux + "\t(" + item.observaciones + ")" + codigos.LF;
          }
          mensajeCocina = mensajeCocina + aux;

          aux = "";

          aux = aux + `${item.cantidad}\t${item.nombre} (${tiempo}) ${codigos.LF}`;
          if (item.observaciones != "") {
            aux = aux + "\t(" + item.observaciones + ")" + codigos.LF;
          }
          mensajeBarra = mensajeBarra + aux;

        }
      }

      mensajeBarra = mensajeBarra + "================================================" + codigos.LF;
      mensajeCocina = mensajeCocina + "================================================" + codigos.LF;


    } else {

      mensajeCocina = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "\n\n\nPEDIDOS COCINA" + codigos.LF + "PRODUCTO\n" + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t\t${nombreOficial}\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + `\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Hora:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.gethora(new Date())}\n${codigos.TEXT_FORMAT.TXT_BOLD_ON} Orden:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.id_folio}` + codigos.LF + codigos.TEXT_FORMAT.TXT_CUSTOM_SIZE(1, 1);
      mensajeBarra = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "\n\n\nPEDIDOS BARRA" + codigos.LF + "PRODUCTO\n" + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t\t${nombreOficial}\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + `\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Hora:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.gethora(new Date())}\n${codigos.TEXT_FORMAT.TXT_BOLD_ON} Orden:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.id_folio}` + codigos.LF + codigos.TEXT_FORMAT.TXT_CUSTOM_SIZE(1, 1);
      mensajeCocinaFria = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "\n\n\nPEDIDOS COCINA FRÍA" + codigos.LF + "PRODUCTO\n" + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.LF + `${codigos.TEXT_FORMAT.TXT_BOLD_ON} Mesa:${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t\t${nombreOficial}\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Mesero:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.usuariosPrd.getNombreUsuario()}` + `\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Hora:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.gethora(new Date())}\n${codigos.TEXT_FORMAT.TXT_BOLD_ON} Orden:${codigos.TEXT_FORMAT.TXT_BOLD_OFF} ${this.id_folio}` + codigos.LF + codigos.TEXT_FORMAT.TXT_CUSTOM_SIZE(1, 1);




      for (let item of arregloEnviar) {
        let tiempo = item.tiempo == undefined ? "" : item.tiempo;

        if (item.notificacion == 1) {

          cocinaBool = true;
          let aux = "";



          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + `*${item.nombre} (${tiempo}) \n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Cantidad: ${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t${item.cantidad}\n`;
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + " Observaciones:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + item.observaciones + "\n_______________________\n";
          mensajeCocina = mensajeCocina + aux;
        } else if (item.notificacion == 2) {
          barrabool = true;
          let aux = "";
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + `*${item.nombre} (${tiempo}) \n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Cantidad: ${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t${item.cantidad}\n`;
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + " Observaciones:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + item.observaciones + "\n_______________________\n";
          mensajeBarra = mensajeBarra + aux;

        } else if (item.notificacion == 3) {

          cocinaFriaBool = true;

          let aux = "";
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + `*${item.nombre} (${tiempo}) \n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Cantidad: ${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t${item.cantidad}\n`;
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + " Observaciones:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + item.observaciones + "\n_______________________\n";
          mensajeCocinaFria = mensajeCocinaFria + aux;
        } else if (item.notificacion == 4) {

          ambos = true;

          let aux = "";
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + `*${item.nombre} (${tiempo})\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Cantidad: ${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t${item.cantidad}\n`;
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + " Observaciones:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + item.observaciones + "\n_______________________\n";
          mensajeCocina = mensajeCocina + aux;

          aux = "";
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + `*${item.nombre} (${tiempo})\n ${codigos.TEXT_FORMAT.TXT_BOLD_ON}Cantidad: ${codigos.TEXT_FORMAT.TXT_BOLD_OFF}\t${item.cantidad}\n`;
          aux = aux + codigos.TEXT_FORMAT.TXT_BOLD_ON + " Observaciones:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + item.observaciones + "\n_______________________\n";
          mensajeBarra = mensajeBarra + aux;

        }
      }

      mensajeBarra = mensajeBarra + "_____________________________\n\n";
      mensajeCocina = mensajeCocina + "____________________________\n\n";
    }
    let configuraciones = this.globales.getConfiguraciones();

    if (configuraciones != null && configuraciones != undefined) {

      let wifi = configuraciones.esImpresoraWifi;
      let cocinaImpresora: boolean = configuraciones.impresoraCocina;
      let cocinafriaImpresora: boolean = configuraciones.impresoraCocinaFria;
      let barraImpresora: boolean = configuraciones.impresoraBarra;

      wifi = wifi == undefined ? false : wifi;
      cocinaImpresora = cocinaImpresora == undefined ? false : cocinaImpresora;
      cocinafriaImpresora = cocinafriaImpresora == undefined ? false : cocinafriaImpresora;
      barraImpresora = barraImpresora == undefined ? false : barraImpresora;



      if (wifi == true) {
        this.cocina(cocinaImpresora, cocinaBool, mensajeCocina).then(() => {
          this.barra(barraImpresora, barrabool, mensajeBarra).then(() => {
            this.cocinafria(cocinafriaImpresora, cocinaFriaBool, mensajeCocinaFria).then(() => {

            });
          });
        });





        cargando.dismiss();
        this.servidoListo("Orden enviada correctamente");

      } else {
        if (cocinabarra == true) {
          mensajeCocina = mensajeCocina + mensajeBarra;
          mensajeBarra = "";
        }

        this.globales.conectarCocina(mensajeCocina).then(cocina => {
          if (cocinabarra != true) {
            this.globales.conectarBarra(mensajeBarra).then(barra => {
              this.servidoListo("Orden enviada correctamente");
              cargando.dismiss();
            }).catch(mensaje => {
              this.servidoListo("Error al enviar a impresora cocina --> barra");
              cargando.dismiss();
            });
          } else {
            this.servidoListo("Orden enviada correctamente");
            cargando.dismiss();
          }
        }).catch(errcocina => {
          this.globales.conectarBarra(mensajeBarra).then(barra => {
            this.servidoListo("Orden enviada correctamente");
            cargando.dismiss();
          }).catch(objmensaje => {
            this.servidoListo("Error al enviar a impresora desde barra");
            cargando.dismiss();
          });
        });
      }

    } else {
      let toasMensaje = this.toasCtrl.create({ message: "Favor de configurar las impresoras", duration: 1500 });

    }
  }

  public servidoListo(mensaje) {

    let toas = this.toasCtrl.create({ message: mensaje, duration: 1500 });
    toas.present();


    this.viewCtrl.dismiss({ servido: true });
  }


  public eliminarLista(obj, indice, indicepadre) {
    if (this.reimprimirModel) {
      obj.servido = !obj.servido;
    } else {
      if (obj.servido != true) {
        let mensaje = this.alertCtrl.create({
          subTitle: "¿Deseas eliminar elemento de la orden?",
          message: "Se eliminara el elemento de la orden antes de ser enviado a concina",
          buttons: [{
            text: "Sí", handler: () => {
              let arreglo1 = this.arreglo[indicepadre];
              arreglo1.splice(indice, 1);
              let toas = this.toasCtrl.create({ message: "Producto eliminado de la orden", duration: 1500 });
              toas.present();
            }
          }, "No"]
        });
        mensaje.present();
      }
    }
  }

  public horaDia() {
    let date = new Date();
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm: any = (hours >= 12) ? 'pm' : 'am';
    hours = hours % 12;
    hours = (hours) ? hours : 12; // the hour '0' should be '12'
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let mes = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();

    let fe = dia + "/" + mes + "/" + date.getFullYear() + " " + strTime;
    return fe;
  }


  public gethora(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  public toogle() {

    if (this.reemprimir == true) {
      for (let item1 of this.arreglo) {
        for (let item of item1) {
          item.servido = true;
        }
      }
    }

  }


  public cocina(cocinaImpresora, cocinaBool, mensajeCocina) {
    var promesa = new Promise((resolver, problema) => {
      if (cocinaImpresora) {

        if (cocinaBool) {

          this.impresionesPrd.enviarWifiCocinaCaliente(mensajeCocina).subscribe(datos => {
            resolver();
          }, err => {
            resolver();
          });
        } else {
          resolver();
        }
      } else {
        resolver();
      }
    });
    return promesa;
  }


  public barra(barraImpresora, barrabool, mensajeBarra) {
    var promesa = new Promise((resolver, problemas) => {
      if (barraImpresora) {

        if (barrabool) {
          this.impresionesPrd.enviarWifiBarra(mensajeBarra).subscribe(datos => {
            resolver();
          }, err => {
            resolver();
          });
        } else {
          resolver();
        }
      } else {
        resolver();
      }
    });


    return promesa;
  }


  public cocinafria(cocinafriaImpresora, cocinaFriaBool, mensajeCocinaFria) {
    var promesa = new Promise((resolver, problemas) => {
      if (cocinafriaImpresora) {
        if (cocinaFriaBool) {
          this.impresionesPrd.enviarWifiCocinaFria(mensajeCocinaFria).subscribe(datos => {
            resolver();
          }, err => {
            resolver();
          });

        } else {
          resolver();
        }

      } else {
        resolver();
      }
    });

    return promesa;
  }

}
