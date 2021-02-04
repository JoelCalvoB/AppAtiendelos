import { Component, ɵConsole } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, AlertController, LoadingController, Platform, PopoverController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { MesasProvider } from '../../providers/mesas/mesas';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasDetallePage } from '../cuentas-detalle/cuentas-detalle';
import { TicketsPage } from '../tickets/tickets';
import { CuentasMesasPage } from '../cuentas-mesas/cuentas-mesas';
import { ImpresionesProvider } from '../../providers/impresiones/impresiones';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Storage } from '@ionic/storage';
import { UsuariosActivosPage } from '../usuarios-activos/usuarios-activos';
import { CuentaDetalleConfigMorePage } from '../cuenta-detalle-config-more/cuenta-detalle-config-more';
import { CurrencyPipe } from '@angular/common';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { CuentasVisualizacionPage } from '../cuentas-visualizacion/cuentas-visualizacion';






@Component({
  selector: 'page-cuentas',
  templateUrl: 'cuentas.html',
})
export class CuentasPage {
  public claveBase
  public id_sucursal;
  public clave;
  public id_usuario;
  public arreglo = [];
  public menutogle: boolean = false;
  public boolCancelar: boolean = false;
  public boolCobrar: boolean = false;
  public indice;
  public contador = 0;
  public indiceAnterior = -1;
  public dateAnterior: any;
  public capitan: boolean = false;
  public deslizar: boolean = false;
  public seleccionarOpcionBool = 0;
  public tittulo: string = "Seleccionar mesa";
  public detenerPeticion: boolean = true;
  public nombresucursal: string = "";
  public isSemi:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private globales: GlobalesProvider,
    private usuariosPrd: UsuariosProvider, private mesasPrd: MesasProvider, private ticketsprd: TicketsProvider,
    private toasCtrl: ToastController, private modalCtrl: ModalController, private alertCtrl: AlertController,
    private impresionesPrd: ImpresionesProvider, private bt: BluetoothSerial, private storage: Storage,
    private loadCtrl: LoadingController, private platform: Platform,
    private poperCtrl: PopoverController, private currency: CurrencyPipe, private sucursalPrd: SucursalesProvider) {
  }

  ionViewDidLoad() {
    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.id_usuario = this.usuariosPrd.getIdUsuario();
    this.capitan = this.usuariosPrd.esCapitanMesero();
    this.isSemi = this.globales.isSemiOnline();
    this.id_usuario = this.capitan == true ? 0 : this.id_usuario;
    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
      this.sucursalPrd.getEspecifico(this.id_sucursal).subscribe(datos => {
        this.nombresucursal = datos.nombre;
      });
    } else {
      this.nombresucursal = "Sucursal 1";
    }

    if (this.capitan == true) {
      this.tittulo = "CAPITAN DE MESEROS: seleccionar mesa";
    }

    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
      this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, this.id_usuario).subscribe(datos => {
        for (let item of datos) {
          item.ocupada = true;
          item.colorear = true;
        }
        this.arreglo = datos;
      });
    } else {
      let usuariosObj = this.usuariosPrd.getUsuario();
      this.arreglo = usuariosObj.tickets;
    }



    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;

    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
      this.detenerPeticion = false;
      this.verificacionTiempoReal();
    } else {
      this.detenerPeticion = true;
    }
  }

  ionViewWillLeave() {
    this.detenerPeticion = true;
    this.deslizar = false;
    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;
  }



  ionViewWillUnload() {

    this.ionViewWillLeave();
    this.deslizar = false;
    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;
  }

  public verificacionTiempoReal() {

    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {

      setTimeout(() => {
        if (!this.detenerPeticion) {
          this.ticketsprd.getCantidadMesas(this.id_sucursal, this.id_usuario).subscribe(datos => {


            if (datos.cantidad != this.arreglo.length) {
              this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, this.id_usuario).subscribe(datos => {
                for (let item of datos) {
                  item.ocupada = true;
                  item.colorear = true;
                }
                this.arreglo = datos;
                this.verificacionTiempoReal();
              });



              this.menutogle = true;
              this.boolCancelar = false;
              this.boolCobrar = false;
            } else {
              this.verificacionTiempoReal();
            }
          }, err => {
            let toast = this.toasCtrl.create({ message: "Error al traer las notificaciones de mesas en tiempo real", closeButtonText: "Entendido", showCloseButton: true });
            toast.present();
          });
        }
      }, 1500);

    }
  }




  ionViewDidEnter() {
    this.ionViewDidLoad();
  }

  public salir() {
    this.globales.cerrarAplicacion();
  }

  public marcar(indice) {
    console.log(indice);

    for (let item of this.arreglo) {
      item.clase = false;
      item.colorear = item.ocupada;
    }

    this.arreglo[indice].colorear = false;
    this.arreglo[indice].clase = true;

    if (this.arreglo[indice].ocupada == true) {
      this.boolCancelar = true;
      this.boolCobrar = true;
    } else {
      this.boolCancelar = false;
      this.boolCobrar = false;
    }

    this.menutogle = true;
    this.indice = indice;
    this.deslizar = true;


    if (this.indice == this.indiceAnterior) {
      var tiempoActual: any = new Date();
      let tiempoTranscurrido = tiempoActual - this.dateAnterior;
      if (tiempoTranscurrido > 250) {
        this.contador = 0;
        this.dateAnterior = new Date();
      }
      this.contador = this.contador + 1;
      if (this.contador == 2) {
        this.traerDetalleProductos();
        this.dateAnterior = new Date();
      } else if (this.contador > 2) {
        this.contador = 1;
      }

    } else {
      this.dateAnterior = new Date();
      this.indiceAnterior = this.indice;
      this.contador = 1;
    }



  }

  public agregar() {

    let idUser = this.usuariosPrd.getIdUsuario();
    let idSucursal = this.usuariosPrd.getSucursal();



    let mostrarMesasDesocupadas = this.modalCtrl.create(CuentasMesasPage, { id_sucursal: this.id_sucursal }, {
      cssClass: 'margen_modal'
    });
    mostrarMesasDesocupadas.present();
    mostrarMesasDesocupadas.onDidDismiss(datos => {
      let mesasLoad = this.loadCtrl.create({ content: "Levantando mesa" });
      mesasLoad.present();
      if (datos != undefined) {
        if (!datos.unir) {
          let mesa = datos.mesa;
          mesa.ocupada = true;
          mesa.colorear = true;

          let tipo = "";
          if (datos.mesa.id_tipo == 1) {
            tipo = "Mesa";
          }

          let obj = {
            idUser: idUser,
            idSucursal: idSucursal,
            idMesa: mesa.id_mesa,
            nombre: `${tipo} ${mesa.id_mesa}`
          }


          if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
            this.ticketsprd.insert(obj, datos.unir).subscribe(datosTicket => {
              this.arreglo.push(datosTicket);
              for (let item of this.arreglo) {
                item.ocupada = true;
                item.colorear = true;
              }
              mesasLoad.dismiss();

              this.boolCancelar = false;
              this.boolCobrar = false;
              this.detenerPeticion = true;
              let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: datosTicket });
              modal.present();
              modal.onDidDismiss(() => {
                this.detenerPeticion = false;
                this.verificacionTiempoReal();
                // this.arreglo.splice(this.indice);

              });
            }, err => {
              mesasLoad.dismiss();
              let toast = this.toasCtrl.create({ message: err.error.message, closeButtonText: "Entendido", showCloseButton: true });
              toast.present();
            });
          } else {
            let usuariobj = this.usuariosPrd.getUsuario();
            for (let item of usuariobj.mesasestablecimiento) {
              if (datos.mesa.id_mesa == item.id_mesa) {

                item.ocupada = true;
                item.colorear = false;
                item.clase = false;
                break;
              }
            }
            let dtfecha = new Date();

            this.arreglo = this.arreglo == undefined ? [] : this.arreglo;

            let ticket = {
              id_ticket: this.arreglo.length + 1,
              nombre: obj.nombre,
              id_user: 0,
              fecha: dtfecha.toLocaleDateString(),
              id_folio: this.arreglo.length + 1,
              hora: dtfecha.toLocaleTimeString(),
              id_mesa: obj.idMesa,
              efectivo_porcentaje: 0,
              cortesia: 0,
              mesa_separada: false,
              preticket: undefined,
              ocupado: true
            }

            this.arreglo.push(ticket);

            usuariobj.tickets = this.arreglo;




            if (!this.globales.isSemiOnline())
              this.storage.set("userfree", usuariobj);
            else
              this.storage.set("usersemi", usuariobj);




            mesasLoad.dismiss();
            let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: ticket });
            modal.present();

          }


        } else {//***Aqui se unen las mesas */

          let mesa = datos.mesa;
          let obj = {
            idUser: idUser,
            idSucursal: idSucursal,
            idMesa: mesa.id_mesa,
            nombre: mesa.nombre,
            mesasAfectadas: mesa.mesasAfectadas
          }


          if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
            this.ticketsprd.insert(obj, datos.unir).subscribe(datosTicket => {
              this.arreglo.push(datosTicket);
              for (let item of this.arreglo) {
                item.ocupada = true;
                item.colorear = true;
              }
              mesasLoad.dismiss();

              this.detenerPeticion = true;
              let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: datosTicket });
              modal.present();

              modal.onDidDismiss(() => {
                this.detenerPeticion = false;
                this.verificacionTiempoReal();
                //  this.arreglo.splice(this.indice);
              });

              this.boolCancelar = false;
              this.boolCobrar = false;

            }, erro => {
              mesasLoad.dismiss();
              let toast = this.toasCtrl.create({ message: erro.error.message, closeButtonText: "Entendido", showCloseButton: true });
              toast.present();
            });
          } else {
            let mesasAfectadas = mesa.mesasAfectadas;
            let usuarioAux = this.usuariosPrd.getUsuario();
            let mesassusursal = usuarioAux.mesasestablecimiento;
            for (let item of mesasAfectadas) {
              for (let auxitem of mesassusursal) {
                if (auxitem.id_mesa == item) {
                  auxitem.ocupada = true;
                  break;
                }
              }
            }
            usuarioAux.mesasestablecimiento = mesassusursal;


            let dtfecha = new Date();


            let ticket = {
              id_ticket: this.arreglo.length + 1,
              nombre: obj.nombre,
              id_user: 0,
              fecha: dtfecha.toLocaleDateString(),
              id_folio: this.arreglo.length + 1,
              hora: dtfecha.toLocaleTimeString(),
              id_mesa: obj.idMesa,
              efectivo_porcentaje: 0,
              cortesia: 0,
              mesa_separada: false,
              preticket: undefined,
              ocupado: true
            }

            this.arreglo.push(ticket);
            

            usuarioAux.tickets = this.arreglo;

            this.storage.set("userfree", usuarioAux);
            this.usuariosPrd.guardarUsuario(usuarioAux, false);
            mesasLoad.dismiss();

            let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: ticket });
            modal.present();
          }
        }
      } else {
        mesasLoad.dismiss();
      }
    });

  }

  public preticketImprimir() {

    let idSucursal = this.usuariosPrd.getSucursal();

    let objTicket = {
      id_mesa: this.arreglo[this.indice].id_mesa,
      id_sucursal: idSucursal,
      id_ticket: this.arreglo[this.indice].id_ticket,
      nombre: this.arreglo[this.indice].nombre
    }

    let loading = this.loadCtrl.create({ content: "Imprimiendo preticket" });
    loading.present();

    if (!this.globales.isSemiOnline() && !this.usuariosPrd.getFree()) {
      this.impresionesPrd.getPreticket(objTicket).then(mensaje => {

        this.enviandoMensajeImpresora(mensaje, loading);
      }).catch(err => {
        let toast = this.toasCtrl.create({ message: err, duration: 1500 });
        toast.present();
        loading.dismiss();
      });
    } else {

      
    let id_ticket = this.arreglo[this.indice].id_ticket;
    this.storage.get(id_ticket).then(ticketObj=>{
       let arregloTicket = [];
       for(let llave in ticketObj){
          let obj1 = ticketObj[llave];
          for(let item of obj1){
              if(!item.servido) continue;

              arregloTicket.push(item);
          }
       }


      this.impresionesPrd.getPreticketOffLine(arregloTicket,this.arreglo[this.indice].nombre).then((mensaje)=>{
        
        this.enviandoMensajeImpresora(mensaje, loading);
      });
      
    });



    }


  }

  public enviandoMensajeImpresora(mensaje, loading) {

    this.arreglo[this.indice].preticket = true;
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
  }

  public cancelar(obj) {

    let alert = this.alertCtrl.create({
      subTitle: "¿Deseas cancelar la cuenta?", buttons: [
        {
          text: "Aceptar", handler: () => {
            this.ticketsprd.getPassword().subscribe(datos => {
              let passwordwebService = datos.password;
              this.cancelando();

              let alert = this.alertCtrl.create({ message: `Código de autorización ${passwordwebService}`, subTitle: "Cuenta cancelada" });
              alert.present();

            }, err => {
              let alert = this.alertCtrl.create({ message: "Solicitar cancelación con Gerente/Encargado", subTitle: "Cancelación" });
              alert.present();
            });
          }
        }, "Cancelar"
      ]
    });

    alert.present();

  }


  public validarClave() {
    let alerta = this.alertCtrl.create({ buttons: [{ text: "Insertar Clave" }] })
    alerta.present();

  }


  public cancelando() {
    let id_ticket = this.arreglo[this.indice].id_ticket;
    this.ticketsprd.cancelar(id_ticket).subscribe(datos => {
      let toas = this.toasCtrl.create({
        message: "Cuenta cancelada correctamente",
        duration: 1500
      });
      toas.present();
      this.storage.remove(id_ticket);
      this.storage.remove("totalComensales" + id_ticket);


      this.arreglo.splice(this.indice, 1);

      this.boolCancelar = false;
      this.boolCobrar = false;

      this.deslizar = false;


    });
    this.ionViewDidEnter();
  }




  public traerDetalleProductos() {
    let objTicket = {
      id_mesa: this.arreglo[this.indice].id_mesa,
      id_sucursal: this.id_sucursal,
      id_ticket: this.arreglo[this.indice].id_ticket,
      nombre: this.arreglo[this.indice].nombre,
      id_folio: this.arreglo[this.indice].id_folio
    }


    this.detenerPeticion = true;
    let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: objTicket });
    modal.present();
    modal.onDidDismiss(datos => {
      this.detenerPeticion = false;
      this.verificacionTiempoReal();
      if (datos != undefined) {

        if (datos == 1) {
          this.ionViewDidLoad();

        } else {

          this.arreglo[this.indice].ocupada = false;
          this.arreglo[this.indice].colorear = false;
          this.navCtrl.push(TicketsPage, { id_ticket: datos.id_ticket, billete: datos.billete });
        }

      }
    });
  }

  public actualizando(refresher): any {
    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.id_usuario = this.usuariosPrd.getIdUsuario();
    this.id_usuario = this.capitan == true ? 0 : this.id_usuario;


    if (!this.globales.isSemiOnline() && !this.usuariosPrd.getFree()) {
      this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, this.id_usuario).subscribe(datos => {
        for (let item of datos) {
          item.ocupada = true;
          item.colorear = true;
        }
        this.arreglo = datos;
        refresher.complete();
      });
    } else {
      
      refresher.complete();
    }

    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;


    this.seleccionarOpcionBool = 0;
    this.deslizar = false;

  }


  public configuraciones() {
    let poper = this.poperCtrl.create(CuentaDetalleConfigMorePage);
    poper.present();
    poper.onDidDismiss(dato => {
      if (dato != undefined) {
        switch (dato) {
          case 1:
            let mensaje = this.alertCtrl.create({
              message: 'Tipo de descuento', inputs: [{
                label: "Efectivo",
                type: "radio",
                value: "1",
                checked: true
              },
              {
                label: "Porcentaje",
                type: "radio",
                value: "2"
              },
              {
                label: "Cortesía",
                type: "radio",
                value: "3"
              }], buttons: [{
                text: "Aceptar",
                handler: (valor) => {
                  this.realizarAccion(valor);
                }
              }, "Cancelar"]
            });

            mensaje.present();
            break;
          case 2:
            let modal = this.modalCtrl.create(UsuariosActivosPage, { id_ticket: this.arreglo[this.indice].id_ticket });
            modal.present();
            modal.onDidDismiss(dat => {
              if (dat != undefined) {
                this.ionViewDidLoad();
              }
            });
            break;
          case 3:
            let modal3 = this.modalCtrl.create(CuentasMesasPage, { id_sucursal: this.id_sucursal });
            modal3.present();
            modal3.onDidDismiss(datos => {
              if (datos != undefined) {
                let mesasLoad = this.loadCtrl.create({ content: "Levantando mesa" });
                mesasLoad.present();
                if (!datos.unir) {
                  let mesa = datos.mesa;

                  let tipo = "";
                  if (datos.mesa.id_tipo == 1) {
                    tipo = "Mesa";
                  }

                  let obj = {
                    idTicket: this.arreglo[this.indice].id_ticket,
                    idMesa: mesa.id_mesa,
                    nombre: `${tipo} ${mesa.id_mesa}`
                  }



                  this.ticketsprd.cambiarMesa(obj, datos.unir).subscribe(datosTicket => {
                    mesasLoad.dismiss();
                    this.ionViewDidLoad();
                  }, err => {
                    mesasLoad.dismiss();
                  });
                } else {//***Aqui se unen las mesas */
                  let mesa = datos.mesa;
                  let obj = {
                    idTicket: this.arreglo[this.indice].id_ticket,
                    idMesa: mesa.id_mesa,
                    nombre: mesa.nombre,
                    mesasAfectadas: mesa.mesasAfectadas
                  }


                  this.ticketsprd.cambiarMesa(obj, datos.unir).subscribe(datosTicket => {
                    mesasLoad.dismiss();
                    this.ionViewDidLoad();
                  }, erro => {
                    mesasLoad.dismiss();
                  });

                }
              }
            });


            break;
          case 4:
            this.aplicarCuentasSeparadas();
            break;

          case 5:

            this.separarMesas();
            break;
          case 6:
            this.unirCuentas();
            break;
          default:
        }
      }
    });
  }

  public aplicarCuentasSeparadas() {

    let alerta = this.alertCtrl.create({
      message: "¿Deseas separar la cuenta entre los comensales?", buttons: [
        {
          text: "si", handler: () => {

            let obj = this.arreglo[this.indice];
            let id_ticket = obj.id_ticket;
            this.storage.get(id_ticket).then(storagepedido => {
              if (storagepedido != null || storagepedido != undefined) {

                let arregloPedidoCliente;
                arregloPedidoCliente = storagepedido;
                let codigos = this.impresionesPrd.getCodigosImpresora();
                let folio = 0;
                let config = this.globales.getConfiguraciones();
                let nombreRestaurante = "";
                let impresora80;
                let iva;
                let ivarecupera;
                if (config != undefined && config != null) {
                  nombreRestaurante = config.nombre;
                  impresora80 = config.impresora80;
                  iva = config.iva;
                  ivarecupera = config.ivarecupera;
                }

                let f = new Date();
                let horaDia = this.horaDia();
                let hora = codigos.LF + codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_2HEIGHT + codigos.TEXT_FORMAT.TXT_BOLD_ON + horaDia + codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.LF;

                let inicio = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_4SQUARE + codigos.TEXT_FORMAT.TXT_BOLD_ON + "TICKET DE COMPRA" + codigos.LF + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.TEXT_FORMAT.TXT_NORMAL + codigos.TEXT_FORMAT.TXT_BOLD_ON + nombreRestaurante + codigos.TEXT_FORMAT.TXT_BOLD_OFF + "\n\n";
                let sucursal = codigos.TEXT_FORMAT.TXT_ALIGN_LT + codigos.TEXT_FORMAT.TXT_BOLD_ON + "Sucursal:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.nombresucursal + codigos.LF;
                let fecha = codigos.TEXT_FORMAT.TXT_BOLD_ON + "Fecha:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear() + ((impresora80 == true) ? "\t" : codigos.LF);
                let mesero = codigos.TEXT_FORMAT.TXT_BOLD_ON + "Mesero:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.usuariosPrd.getNombreUsuario() + codigos.LF;
                let cuenta = codigos.TEXT_FORMAT.TXT_BOLD_ON + "Folio:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + folio + ((impresora80 == true) ? "\t\t" : codigos.LF);;
                let mesa = codigos.TEXT_FORMAT.TXT_BOLD_ON + "Mesa:" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + this.arreglo[this.indice].nombre + codigos.LF + hora + codigos.LF + codigos.LF + codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_BOLD_ON + "PRODUCTOS CONSUMIDOS" + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF;

                let imprimirimpresora = [];
                let mensajefinal = "";

                for (let llave in arregloPedidoCliente) {
                  let comensal = codigos.TEXT_FORMAT.TXT_ALIGN_CT + codigos.TEXT_FORMAT.TXT_BOLD_ON + llave + codigos.TEXT_FORMAT.TXT_BOLD_OFF + codigos.LF;
                  let mensaje = inicio + sucursal + fecha + mesero + cuenta + mesa + comensal;
                  let total = 0;
                  let productosaux = "";
                  for (let i of arregloPedidoCliente[llave]) {


                    //  mensaje = mensaje + " " + i.cantidad + " " + i.nombre + "\n\t\t" + this.currency.transform(i.precio) + "\n";
                    total = total + (i.precio * i.cantidad);

                    let cantidad = i.cantidad;
                    let nombre = i.nombre;
                    let unitario = this.currency.transform(i.precio);
                    let precioTotalCantidad = this.currency.transform(i.cantidad * i.precio);

                    folio = i.id_folio;
                    let auxLetrero = "";

                    if (i.cortesia == 1 || i.cortesia == 2) {
                      auxLetrero = "\n\t\tDESCUENTO";

                    } else if (i.cortesia == 3) {
                      auxLetrero = "\n\t\t CORTESIA";
                    } else {
                      auxLetrero = `\n\t\t${(impresora80 == true) ? "\t" : ""} ${unitario}`
                    }



                    productosaux = productosaux + `${cantidad} ` + nombre + `${auxLetrero}  ${precioTotalCantidad}\n`




                  }
                  mensaje = mensaje + productosaux;
                  mensaje = mensaje + " TOTAL: " + this.currency.transform(total) + "\n";
                  mensaje = mensaje + "------------------------------\n";
                  mensaje = mensaje + "\n\n" + codigos.TEXT_FORMAT.TXT_ALIGN_CT + "GRACIAS POR SU PREFERENCIA\n\n\n-------------------------------\n\n";;

                  imprimirimpresora.push(mensaje);
                  mensajefinal = mensajefinal + mensaje;
                }




                let configura = this.globales.getConfiguraciones();
                let wifi: boolean = false;
                let impresoraCajero: boolean = false;
                if (configura != undefined || configura != null) {
                  wifi = configura.esImpresoraWifi;
                  impresoraCajero = configura.impresoraCajero;
                }
                wifi = wifi == undefined ? false : wifi;
                impresoraCajero = impresoraCajero == undefined ? false : impresoraCajero;

                if (impresoraCajero == true) {
                  if (wifi == true) {

                    for (let ii of imprimirimpresora) {

                    }

                  } else {
                    if (this.platform.is('cordova')) {
                      this.globales.conectarCajero(mensajefinal);
                    }
                  }

                } else {
                  let toast = this.toasCtrl.create({ message: "Impresora desactivada, activar en configuraciones", duration: 1500 });
                  toast.present();
                }


              }
            });

          }
        }, "No"
      ]
    });


    alerta.present();
  }

  public horaDia() {
    let date = new Date();
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm: any = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  public realizarAccion(valor) {
    let obj = {
      idTicket: this.arreglo[this.indice].id_ticket,
      cortesia: valor,
      efectivo_porcentaje: 0
    }

    if (valor == 1) {

      let mensaje = this.alertCtrl.create({
        message: "Efectivo a descontar",
        inputs: [{ type: "number", name: "efectivo", value: "0", placeholder: "Efectivo" }],
        buttons: [{
          text: "Aceptar", handler: dat => {
            obj.efectivo_porcentaje = dat.efectivo;
            let aplicando = this.loadCtrl.create({ content: "Aplicando descuento" });
            aplicando.present();
            this.ticketsprd.aplicandoDescuento(obj).subscribe(datos => {
              aplicando.dismiss();
              let toas = this.toasCtrl.create({ message: "Descuento aplicado", duration: 1500 });
              toas.present();
            });
          }
        }, "Cancelar"]
      });
      mensaje.present();
    } else if (valor == 2) {
      let mensaje = this.alertCtrl.create({
        message: "Porcentaje a descontar",
        inputs: [{ type: "number", name: "efectivo", value: "0", placeholder: "Porcentaje" }],
        buttons: [{
          text: "Aceptar", handler: dat => {
            obj.efectivo_porcentaje = dat.efectivo;
            let aplicando = this.loadCtrl.create({ content: "Aplicando descuento" });
            aplicando.present();
            this.ticketsprd.aplicandoDescuento(obj).subscribe(datos => {
              aplicando.dismiss();
              let toas = this.toasCtrl.create({ message: "Descuento aplicado", duration: 1500 });
              toas.present();
            });
          }
        }, "Cancelar"]
      });
      mensaje.present();
    } else {
      obj.efectivo_porcentaje = 0;
      let aplicando = this.loadCtrl.create({ content: "Aplicando descuento" });
      aplicando.present();
      this.ticketsprd.aplicandoDescuento(obj).subscribe(datos => {
        aplicando.dismiss();
        let toas = this.toasCtrl.create({ message: "Descuento aplicado", duration: 1500 });
        toas.present();
      });
    }

  }

  public separarMesas() {

    let mensaje = this.alertCtrl.create({
      subTitle: "Dividir mesa", message: "Seleccione en cuantas partes se divide la mesa",
      inputs: [{ type: "radio", value: "2", label: "Dividir a la mitad", checked: true },
      { type: "radio", value: "3", label: "Dividir en 3 partes" },
      { type: "radio", value: "4", label: "Dividir en 4 partes" },
      { type: "radio", value: "5", label: "Dividir en 5 partes" }], buttons: [
        {
          text: "Aceptar", handler: datos => {

            let cargando = this.loadCtrl.create({ content: "Separando mesas" });
            cargando.present();
            this.ticketsprd.separarMesas(this.arreglo[this.indice].id_ticket, datos).subscribe(datos => {
              this.ionViewDidLoad();
              cargando.dismiss();
            }, err => {
              cargando.dismiss();
              let toast = this.toasCtrl.create({ message: "Error al separar mesas, contactar a soporte", closeButtonText: "Entendido" });
              toast.present();
            });
          }
        }
      ]
    });

    mensaje.present();

  }



  public renombrar(indice)
  {
    let obj;
    if (indice==undefined)return;
    let id_mesa = this.arreglo[indice]["id_mesa"];
    let nombre_mesa = this.arreglo[indice]["nombre"];
   /*  this.ticketsprd.actualizaMesa(obj).subscribe(datos =>{

    }) */
    console.log("mesa" + id_mesa);
    console.log(this.arreglo)



    let alert = this.alertCtrl.create({
      subTitle: "Renombrar Orden", inputs: [
        { type: "text", placeholder: "Nuevo identificador", name: "alias" }
      ], buttons: [{
        text: "Aceptar", handler: (respuesta) => {
          let idUser = this.usuariosPrd.getIdUsuario();
          let idSucursal = this.usuariosPrd.getSucursal();

          let obj = {
            idMesa: id_mesa,
            nombre: nombre_mesa,
            nuevo : respuesta.alias
          }

          console.log(obj);

    this.ticketsprd.actualizaMesa(obj).subscribe(datos=>{
this.arreglo[indice]["nombre"]=obj.nuevo;
    })
    
        }
      }, "Cancelar"]
    });
    


    alert.present();
  }


  public llevar() {
  



    let alert = this.alertCtrl.create({
      subTitle: "Orden alias", inputs: [
        { type: "text", placeholder: "Alias del pedido", name: "alias" }
      ], buttons: [{
        text: "Aceptar", handler: (respuesta) => {
          let idUser = this.usuariosPrd.getIdUsuario();
          let idSucursal = this.usuariosPrd.getSucursal();

          let obj = {
            idUser: idUser,
            idSucursal: idSucursal,
            idMesa: 0,
            nombre: respuesta.alias
          }

          if (obj.nombre == "" || obj.nombre == " ") {
            let toas = this.toasCtrl.create({ message: "Campo Vacío", duration: 1500 });
            toas.present();
            this.llevar;
            return;
          }

          let mesasLoad = this.loadCtrl.create({ content: "Levantando pedido" });
          mesasLoad.present();

          this.ticketsprd.insertAlias(obj).subscribe(datosTicket => {
            this.arreglo.push(datosTicket);
            for (let item of this.arreglo) {
              item.ocupada = true;
              item.colorear = true;
            }
            mesasLoad.dismiss();

            this.boolCancelar = false;
            this.boolCobrar = false;
            this.detenerPeticion = true;
            let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: datosTicket });
            modal.present();

            modal.onDidDismiss(() => {
              this.detenerPeticion = false;
              this.verificacionTiempoReal();
            });
          });


        }
      }, "Cancelar"]
    });

    alert.present();
  }

  public seleccionarOpcion(opc) {
    this.seleccionarOpcionBool = opc;
  }

  public autorizar() {
    let alerta = this.alertCtrl.create({
      message: "¿Deseas generar la llave de autorización?",
      buttons: [{
        text: "Si", handler: () => {
          this.ticketsprd.establecerKey().subscribe(datos => {

            let alerta2 = this.alertCtrl.create({ subTitle: `La llave generada es: ${datos.password}`, buttons: ["Entendido"] });
            alerta2.present();
          });
        }
      }, "No"]
    });

    alerta.present();
  }

  public unirCuentas() {

    let modal = this.modalCtrl.create(CuentasMesasPage, { unircuentas: true, id_sucursal: this.id_sucursal, ticket: this.arreglo[this.indice] });
    modal.present();

    modal.onDidDismiss(datos => {
      if (datos != undefined) {
        for (let item of datos.cuentas) {
          item.idTicket = item.id_ticket;
          item.idSucursal = this.id_sucursal;
          item.idMesa = item.id_mesa;
        }
        this.ticketsprd.unircuentas(datos.ticket.id_ticket, datos.cuentas).subscribe(respuesta => {
          let toast = this.toasCtrl.create({ message: "Se unieron las cuentas con exito", duration: 1500 });
          toast.present();
        });
      }
    });
  }


  public verTodasMesas() {

    let modal = this.modalCtrl.create(CuentasVisualizacionPage, {}, {
      cssClass: 'bottom_modal'
    });
    modal.present();
  }


  public sincronizar(){

  }

}
