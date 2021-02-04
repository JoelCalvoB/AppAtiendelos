import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Slides, ToastController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasTotalPage } from '../cuentas-total/cuentas-total';
import { CuentaDetalleConfigPage } from '../cuenta-detalle-config/cuenta-detalle-config';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { Storage } from '@ionic/storage';
import { ConfiguracionMeseroProvider } from '../../providers/configuracion-mesero/configuracion-mesero';
import { GlobalesProvider } from '../../providers/globales/globales';
import { CuentasDetalleAntesdeenviarPage } from '../cuentas-detalle-antesdeenviar/cuentas-detalle-antesdeenviar';
import { CuentasDetalleProductosPage } from '../cuentas-detalle-productos/cuentas-detalle-productos';
import { CuentasDetalleSubcategoriaPage } from '../cuentas-detalle-subcategoria/cuentas-detalle-subcategoria';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { CuentasMesasPage } from '../cuentas-mesas/cuentas-mesas';
import { ProductosPage } from '../productos/productos';



@Component({
  selector: 'page-cuentas-detalle',
  templateUrl: 'cuentas-detalle.html',
})
export class CuentasDetallePage {

  @ViewChild('slider') slider: Slides;
  @ViewChild("segments") segments;
  page: any;
  public arreglo = [];
  public objTicket;
  public arregloPedidoCliente: any = {};
  public regresar: boolean = false;

  public letras: string = "";
  public buscarbool: boolean = false;


  public id_ticket;
  public detalle: any = [];
  public total = 0;
  public servidosTodos: boolean;
  public intTotalComensales = 1;
  public comensalSeleccionado = 1;
  public id_sucursal;
  public cargadoicon = false;
  public arregloBusqueda = [];
  public arreglomostrar = [];
  private indice = 0;
  private aparecerOpcionesBool: boolean = false;
  public aparecerComensales: boolean = false;
  public llave: string = "";
  public arregloSeparar;
  public arregloaux;
  public esVenta: boolean = false;
  public detalleobservaciones: boolean = false;
  public objActual;
  public desmoronarbool: boolean = false;
  public desmoronaritems: boolean = false;
  private consulta: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private ticketsPrd: TicketsProvider, private storage: Storage, private globales: GlobalesProvider, private alertctrl: AlertController,
    private actionshetCtrl: ActionSheetController, private usuariosPrd: UsuariosProvider) {

    if (!this.usuariosPrd.getFree()) {
      this.id_sucursal = this.usuariosPrd.getSucursal();

      this.storage.get("listaproductosdetallemesa").then(valor => {
        this.arreglo = valor.listaproductos;


        for (let x of this.arreglo) {
          if (x.submenu != true) {

            for (let y of x.productos) {
              y.cantidad = 1;
              y.ruta_imagen = "data:image/png;base64," + y.ruta_imagen;
              this.arregloBusqueda.push(y);
            }
          } else {

            x.submenu_array = this.submenus(x.submenu_array);
          }
        }
      });





      this.objTicket = navParams.get("objTicket");
      this.consulta = navParams.get("consulta");

      this.consulta = this.consulta == undefined ? false : this.consulta;

      if (this.objTicket != undefined) {

        this.id_ticket = this.objTicket.id_ticket;
        this.arregloPedidoCliente.cliente1 = [];
        this.storage.get(this.objTicket.id_ticket).then(storagepedido => {
          if (storagepedido != null || storagepedido != undefined) {
            this.arregloPedidoCliente = storagepedido;
            if (this.globales.isSemiOnline()) {
              this.cargandodetalleOffline();
            }
          }
        });



        if (!this.globales.isSemiOnline()) {
          this.cargandodetalle();
        } else {
          this.cargandodetalleOffline();
        }

        this.storage.get("totalComensales" + this.id_ticket).then(datoComensal => {
          if (datoComensal != undefined) {
            this.intTotalComensales = datoComensal;
          }
        });

        this.esVenta = false;
      } else {

        this.esVenta = true;
      }
    } else {

      this.objTicket = navParams.get("objTicket");
      this.storage.get("listaproductosdetallemesa").then(datt => {
        if (datt != null && datt != undefined) {
          this.arreglo = datt.listaproductos;


          for (let x of this.arreglo) {
            if (x.submenu != true) {

              for (let y of x.productos) {
                y.cantidad = 1;
                y.ruta_imagen = "data:image/png;base64," + y.ruta_imagen;
                this.arregloBusqueda.push(y);
              }
            } else {

              x.submenu_array = this.submenus(x.submenu_array);
            }
          }
        } else {
          let mensajeAlerta = this.alertctrl.create({
            title: "Aviso", subTitle: "No hay productos ni categorías en el catálogo.", message: "¿Desea agregar productos?", buttons: [
              {
                text: "Aceptar", handler: () => {
                  this.navCtrl.popAll();
                  this.navCtrl.push(ProductosPage);
                }
              }, "Cancelar"
            ]
          });
          mensajeAlerta.present();
        }
      });
    }


  }



  public detenerPeticion: boolean = false;
  public cerrado: boolean = false;
  ionViewWillLeave() {
    this.detenerPeticion = true;
  }


  ionViewWillUnload() {
    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {

      if (!this.esVenta) {
        this.ionViewWillLeave();

      }
    }
  }

  public verificacionTiempoReal() {

    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {

      if (!this.esVenta) {
        setTimeout(() => {


          if (!this.detenerPeticion) {
            this.ticketsPrd.getTicketActivo(this.id_ticket).subscribe(datos => {

              this.verificacionTiempoReal();
            }, err => {
              if (!this.cerrado) {
                this.cerrado = true;
                let toast = this.toastCtrl.create({ message: `El folio ${this.objTicket.id_folio} ya fue Cobrado / Cancelado,Favor de verificarlo con el capitan de meseros o la persona encargada`, closeButtonText: "Entendido", showCloseButton: true });
                toast.present();
                this.viewCtrl.dismiss();
              }
            });
          }
        }, 1500);


      }
    }
  }


  public submenus(array) {

    for (let submenu of array) {
      if (submenu.submenu != true) {
        for (let ysub of submenu.productos) {
          ysub.cantidad = 1;
          ysub.ruta_imagen = "data:image/png;base64," + ysub.ruta_imagen;
          this.arregloBusqueda.push(ysub);
        }
      } else {
        submenu.submenu_array = this.submenus(submenu.submenu_array);
      }
    }

    return array;
  }


  ionViewDidEnter() {
    this.slideChanged();
    if (!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()) {
      this.verificacionTiempoReal();
    }
  }

  ionViewDidLoad() {
    //this.selectedTab(0);
  }

  ionViewDidLeave() {

  }


  selectedTab(index) {

    this.regresar = index != 0;

    this.slider.slideTo(index);


  }



  slideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    let slides_count = this.segments.nativeElement.childElementCount;
    this.page = currentIndex.toString();
    let numero = Number(this.page);

    this.regresar = numero != 0;

    if (this.page >= slides_count)
      this.page = (slides_count - 1).toString();


    this.centerScroll();
  }


  centerScroll() {
    if (!this.segments || !this.segments.nativeElement)
      return;

    let sizeLeft = this.sizeLeft();
    let sizeCurrent = this.segments.nativeElement.children[this.page].clientWidth;
    let result = sizeLeft - (window.innerWidth / 2) + (sizeCurrent / 2);

    result = (result > 0) ? result : 0;

    this.smoothScrollTo(result);
  }


  sizeLeft() {
    let size = 0;
    for (let i = 0; i < this.page; i++) {
      size += this.segments.nativeElement.children[i].clientWidth;
    }
    return size;
  }


  easeInOutQuart(time, from, distance, duration) {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
  }


  smoothScrollTo(endX) {
    let startTime = new Date().getTime();
    let startX = this.segments.nativeElement.scrollLeft;
    let distanceX = endX - startX;
    let duration = 400;

    let timer = setInterval(() => {
      var time = new Date().getTime() - startTime;
      var newX = this.easeInOutQuart(time, startX, distanceX, duration);
      if (time >= duration) {
        clearInterval(timer);
      }
      this.segments.nativeElement.scrollLeft = newX;
    }, 1000 / 60); // 60 fps
  }

  public salir() {
    this.viewCtrl.dismiss();
  }








  public agregandoProducto(obj) {


    let id_ticket = this.objTicket.id_ticket;
    let id_producto = obj.id_producto;
    let cantidad = obj.cantidad;
    let observaciones = obj.observaciones;
    let objDetalleTicket = {
      id_ticket: id_ticket,
      id_producto: id_producto,
      cantidad: cantidad,
      observaciones: observaciones,
      nombre: obj.nombre,
      ruta_imagen: "",
      servido: false,
      notificacion: obj.notificacion,
      precio: obj.precio,
      tiempo: (obj.tiempo == undefined) ? "" : obj.tiempo
    }

    if (objDetalleTicket.observaciones == null) {
      objDetalleTicket.observaciones = "";
    }

    objDetalleTicket.ruta_imagen = obj.ruta_imagen;
    objDetalleTicket.servido = false;

    this.insertarDetalleConsumidor(objDetalleTicket);
    obj.cantidad = 1;



    obj.observaciones = "";

  }

  public insertarDetalleConsumidor(obj) {
    let comensal = "cliente" + this.comensalSeleccionado;

    let arreglo = this.arregloPedidoCliente[comensal];


    arreglo.push(obj);

    this.storage.set(this.objTicket.id_ticket, this.arregloPedidoCliente);
    let mensaje = this.toastCtrl.create({ message: "Producto agregado a la orden a enviar", duration: 1500 });
    mensaje.present();
  }





  public verCuenta() {

    let ventana = this.modalCtrl.create(CuentasDetalleAntesdeenviarPage, { arreglo: this.arregloPedidoCliente, id_mesa: this.objTicket.nombre, id_ticket: this.objTicket.id_ticket, id_folio: this.objTicket.id_folio }, {
      cssClass: 'margen_modal'
    });
    ventana.present();
    ventana.onDidDismiss(datos => {


      if (!this.esVenta) {
        this.detenerPeticion = false;
        this.verificacionTiempoReal();


        if (datos != null || datos != undefined) {

          if (datos == true) {
            let toast = this.toastCtrl.create({ message: `El folio ${this.objTicket.id_folio} ya fue Cobrado / Cancelado,Favor de verificarlo con el capitan de meseros o la persona encargada`, closeButtonText: "Entendido", showCloseButton: true });
            toast.present();
            this.viewCtrl.dismiss();
          } else {

            if (datos.servido == true) {
              this.cerrarcuentasdetalle(datos);
            }
          }
        }

      } else {

        this.viewCtrl.dismiss(datos);
      }



    });
  }



  public cerrarcuentasdetalle(datos) {


    if (datos.servido == true) {

      if (!this.globales.isSemiOnline() && !this.usuariosPrd.getFree()) {
        this.cargadoicon = true;

        this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
          this.cargadoicon = false;
          this.detalle = datos;
          this.total = 0;
          for (let item of datos) {
            if (item.cancelado == true) {
              item.cantidad = 0;
            }
            this.total = this.total + (item.precio);
            if (this.servidosTodos == true) {
              if (item.servido == false) {
                this.servidosTodos = false;
              }
            }
          }
        }, err => {
          this.cargadoicon = false;
          let toast = this.toastCtrl.create({ message: "Error al traer el detalle del ticket, Favor de verificar internet", closeButtonText: "Entendido", showCloseButton: true });
          toast.present();
        });
      } else {
        this.cargandodetalleOffline();
      }
    }

  }



  public configuracion() {
    let configuracion = this.modalCtrl.create(CuentaDetalleConfigPage, { total: this.intTotalComensales, id_ticket: this.id_ticket }, { cssClass: 'margen_modal' });
    configuracion.present();
    configuracion.onDidDismiss(datos => {
      if (datos != undefined) {

        if (datos == 1) {
          this.viewCtrl.dismiss(1);

        } else {

          this.storage.set("totalComensales" + this.id_ticket, datos.total.length);
          this.intTotalComensales = datos.total.length;


          this.comensalSeleccionado = datos.seleccionado.numero;

          if (datos.total.length >= 2) {
            for (let x = 2; x <= datos.total.length; x++) {
              let llave = "cliente" + x;

              if (this.arregloPedidoCliente[llave] == undefined) {
                this.arregloPedidoCliente[llave] = [];
              }
            }
          }


          this.storage.set(this.objTicket.id_ticket, this.arregloPedidoCliente);

        }
      }
    });
  }





  public seleccionar(obj) {

    if (obj.submenu != true) {
      let submenu = obj.submenu_array;

      let modal = this.modalCtrl.create(CuentasDetalleProductosPage, {
        arreglo: obj.productos, metodo: this.agregandoProducto, objticket: this.objTicket, insertarDetalleConsumidor: this.insertarDetalleConsumidor,
        comensalSeleccionado: this.comensalSeleccionado, arregloPedidoCliente: this.arregloPedidoCliente
      });
      modal.present();
      modal.onDidDismiss(producto => {
        if (!this.esVenta) {
          this.detenerPeticion = false;
          this.verificacionTiempoReal();

          if (producto != undefined && producto != null) {
            if (producto == true) {
              let toast = this.toastCtrl.create({ message: `El folio ${this.objTicket.id_folio} ya fue Cobrado / Cancelado,Favor de verificarlo con el capitan de meseros o la persona encargada`, closeButtonText: "Entendido", showCloseButton: true });
              toast.present();
              this.viewCtrl.dismiss();
            } else {
              if (producto.servido == true) {
                this.cerrarcuentasdetalle(producto);
              }
            }
          }
        } else {
          this.viewCtrl.dismiss(producto);
        }
      });

    } else {

      let modal = this.modalCtrl.create(CuentasDetalleSubcategoriaPage, {
        arreglo: obj.submenu_array, metodo: this.agregandoProducto, objticket: this.objTicket, insertarDetalleConsumidor: this.insertarDetalleConsumidor,
        comensalSeleccionado: this.comensalSeleccionado, arregloPedidoCliente: this.arregloPedidoCliente
      });
      modal.present();
      modal.onDidDismiss(producto => {

        if (!this.esVenta) {
          this.detenerPeticion = false;
          this.verificacionTiempoReal();
          if (producto != undefined && producto != null) {
            if (producto == true) {
              let toast = this.toastCtrl.create({ message: `El folio ${this.objTicket.id_folio} ya fue Cobrado / Cancelado,Favor de verificarlo con el capitan de meseros o la persona encargada`, closeButtonText: "Entendido", showCloseButton: true });
              toast.present();
              this.viewCtrl.dismiss();
            } else {
              if (producto.servido == true) {
                this.cerrarcuentasdetalle(producto);
              }
            }

          }
        } else {
          this.viewCtrl.dismiss(producto);
        }
      });
    }
  }



  public cancelardetalle(obj): any {
    if (this.consulta) return;
    let objenviar = {
      id: obj.id,
      id_producto: obj.id_producto,
      cantidad: obj.cantidad,
      cancelado: true
    }



    const actionSheet = this.actionshetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'accionshet',
      buttons: [
        {
          text: 'Descuento',
          icon: "pricetags",
          handler: () => {

            let alert = this.alertctrl.create({
              subTitle: "¿Deseas realizar algún descuento?", buttons: [
                {
                  text: "Aceptar", handler: () => {
                    this.ticketsPrd.getPassword().subscribe(datos => {
                      let passwordwebService = datos.password;
                      this.alertaPorcentaje(obj);

                      let alert = this.alertctrl.create({ message: `Código de autorización ${passwordwebService}`, subTitle: "Cuenta cancelada" });
                      alert.present();

                    }, err => {
                      let alert = this.alertctrl.create({ message: "Solicitar cancelación con Gerente/Encargado", subTitle: "Cancelación" });
                      alert.present();
                    });
                  }
                }, "Cancelar"
              ]
            });

            alert.present();
          }
        }, {
          text: 'Cortesia',
          icon: "happy",
          handler: () => {
            const alerta = this.alertctrl.create({
              title: "Aviso",
              subTitle: "¿Desea dar de cortesía el producto de la orden?",
              buttons: [{
                text: "Aceptar",
                handler: () => {

                  this.ticketsPrd.getPassword().subscribe(datos => {
                    let passwordwebService = datos.password;
                    let objenviar = {
                      id: obj.id,
                      cortesia: 3
                    }

                    this.ticketsPrd.actualizarDetalleTicket(objenviar).subscribe(respues1 => {
                      let toas = this.toastCtrl.create({ message: respues1.respuesta, duration: 1500 });
                      toas.present();
                      this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
                        this.detalle = datos;
                        this.total = 0;
                        for (let item of datos) {
                          if (item.cancelado == true) {
                            item.cantidad = 0;
                          }
                          this.total = this.total + (item.precio);
                          if (this.servidosTodos == true) {
                            if (item.servido == false) {
                              this.servidosTodos = false;
                            }
                          }
                        }
                      });
                    });


                    let alert = this.alertctrl.create({ message: `Código de autorización ${passwordwebService}`, subTitle: "Cuenta cancelada" });
                    alert.present();

                  }, err => {
                    let alert = this.alertctrl.create({ message: "Solicitar cancelación con Gerente/Encargado", subTitle: "Cancelación" });
                    alert.present();
                  });

                }
              }]
            });
            alerta.present();

            //----------------------------------


            //------------------------
          }
        }, {
          text: "Mover de mesa", icon: "swap", handler: () => {
            let alerta = this.alertctrl.create({
              message: "Deseas cambiar el producto de mesa?", buttons: [{
                text: "Si", handler: () => {
                  let modal = this.modalCtrl.create(CuentasMesasPage, { desabilitar: true, id_sucursal: this.id_sucursal });
                  modal.present();
                  modal.onDidDismiss(mesa => {
                    if (mesa != undefined) {

                      let obj1 = { id_mesa: mesa.mesa.id_mesa, id_producto: obj.id, id_ticket: this.id_ticket, id_ticketnuevo: mesa.mesa.id_ticket };
                      this.ticketsPrd.cambiarProductoMesa(obj1).subscribe(recibe => {
                        let toast = this.toastCtrl.create({ message: "Producto se cambio de mesa con exito", duration: 1500 });
                        toast.present();
                        this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {

                          this.detalle = datos;
                          this.total = 0;
                          for (let item of datos) {
                            if (item.cancelado == true) {
                              item.cantidad = 0;
                            }
                            this.total = this.total + (item.precio);
                            if (this.servidosTodos == true) {
                              if (item.servido == false) {
                                this.servidosTodos = false;
                              }
                            }
                          }
                        });
                      }, err => {
                        let toast = this.toastCtrl.create({ message: "No se pudo cambiar producto de mesa", closeButtonText: "Entendido", showCloseButton: true });
                        toast.present();
                      });
                    }
                  });
                }
              }, "No"]
            });
            alerta.present();
          }
        },
        {
          text: 'Cancelar producto',
          icon: "close",
          cssClass: 'colorBoton',
          handler: () => {
            const alerta = this.alertctrl.create({
              title: "Aviso",
              subTitle: "¿Desea cancelar el producto de la orden?",
              buttons: [{
                text: "Aceptar",
                handler: () => {


                  this.ticketsPrd.getPassword().subscribe(datos => {
                    let passwordwebService = datos.password;
                    //***********************CODIGO DE CANDELADO */


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
                          this.total = this.total + (item.precio);
                          if (this.servidosTodos == true) {
                            if (item.servido == false) {
                              this.servidosTodos = false;
                            }
                          }
                        }
                      });
                    });



                    //**********************TERMINA CODIGO DE CANDELADO */

                    let alert = this.alertctrl.create({ message: `Código de autorización ${passwordwebService}`, subTitle: "Cuenta cancelada" });
                    alert.present();

                  }, err => {
                    let alert = this.alertctrl.create({ message: "Solicitar cancelación con Gerente/Encargado", subTitle: "Cancelación" });
                    alert.present();
                  });


                }
              },
              {
                text: "Cancelar"
              }]
            });
            alerta.present();





          }
        }
      ]
    });
    actionSheet.present();
  }

  public modificaCuenta(obj) {

    const actionSheet = this.actionshetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'action-sheets-groups-page',
      buttons: [
        {
          text: 'Modificar',
          icon: "brush",
          handler: () => {
            let alerta = this.alertctrl.create({
              buttons: [{ text: "Cancelar" }, {
                text: "Actualizar", handler: data => {
                  obj.cantidad = data.texto;
                  let objenviar = {
                    id: obj.id,
                    cantidad: obj.cantidad,
                    cancelado: false,
                    id_sucursal: this.id_sucursal
                  }



                  this.ticketsPrd.actualizarDetalleTicket(objenviar).subscribe(respues1 => {
                    let toas = this.toastCtrl.create({ message: respues1.respuesta, duration: 1500 });
                    toas.present();
                    this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
                      this.detalle = datos;
                      this.total = 0;
                      for (let item of datos) {
                        if (item.cancelado == true) {
                          item.cantidad = 0;
                        }
                        this.total = this.total + (item.precio);
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
            const alerta = this.alertctrl.create({
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
                        this.total = this.total + (item.precio);
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


  public alertaPorcentaje(obj) {
    let alerta = this.alertctrl.create({
      message: "Seleccionar método de descuento",
      inputs: [
        {
          label: "Efectivo",
          type: "radio",
          checked: true,
          name: "efectivo",
          value: "1"
        },
        {
          label: "Porcentaje",
          type: "radio",
          name: "porcentaje",
          value: "2"
        }
      ],
      buttons: [{
        text: "Aceptar",
        handler: (parametro) => {

          let mensaje = parametro == 2 ? "Porcentaje a aplicar" : "Efectivo a aplicar";

          let porcentaje = this.alertctrl.create({
            inputs: [{ type: "number", value: "0", name: "texto" }], message: mensaje,
            buttons: [{
              text: "Actualizar", handler: data => {
                //obj.cantidad = data.texto;
                let objenviar = {
                  id: obj.id,
                  cortesia: parametro,
                  efectivo_porcentaje: data.texto
                }



                this.ticketsPrd.actualizarDetalleTicket(objenviar).subscribe(respues1 => {
                  let toas = this.toastCtrl.create({ message: respues1.respuesta, duration: 1500 });
                  toas.present();
                  this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {

                    this.detalle = datos;
                    this.total = 0;
                    for (let item of datos) {
                      if (item.cancelado == true) {
                        item.cantidad = 0;
                      }
                      this.total = this.total + (item.precio);
                      if (this.servidosTodos == true) {
                        if (item.servido == false) {
                          this.servidosTodos = false;
                        }
                      }
                    }
                  });
                });
              }
            }, "Cancelar"]
          });

          porcentaje.present();
        }
      }, "Cancelar"]
    });
    alerta.present();

  }

  public getItems(evento) {

    this.arreglomostrar = [];
    this.indice = 0;
    let x = 0;
    while (true) {



      if (x < this.arregloBusqueda.length) {

        if (this.indice < 10) {
          if (this.arregloBusqueda[x].nombre.toLocaleLowerCase().includes(this.letras.toLocaleLowerCase())) {
            this.arreglomostrar.push(this.arregloBusqueda[x]);
            this.indice = this.indice + 1;
          }
          x = x + 1;
        } else {
          break;
        }
      } else {
        break;
      }
    }

  }

  public buscar() {
    this.buscarbool = true;
    if (10 > this.arregloBusqueda.length) {
      this.arreglomostrar = this.arregloBusqueda;
    } else {
      for (let x = 0; x < 10; x++) {
        this.arreglomostrar.push(this.arregloBusqueda[x]);
      }


    }

  }
  public buscarcerrar() {
    this.buscarbool = false;
    this.letras = "";
    this.detalleobservaciones = false;
    this.objActual.tiempo = "";
    this.objActual.observaciones = "";
  }

  public getcantidad(indice): any {
    return this.arreglomostrar[indice].cantidad;
  }



  public restar(indice): any {
    let cantidad = this.arreglomostrar[indice].cantidad;
    if (cantidad == 1)
      cantidad = 1;
    else
      cantidad = cantidad - 1;

    this.arreglomostrar[indice].cantidad = cantidad;
  }

  public sumar(indice): any {
    let cantidad = this.arreglomostrar[indice].cantidad;
    cantidad = cantidad + 1;
    this.arreglomostrar[indice].cantidad = cantidad;

  }


  public agregarObservaciones(obj) {


    this.detalleobservaciones = true;
    this.objActual = obj;
  }


  public addMesa(obj) {
    let aviso = this.alertctrl.create({
      subTitle: "Aviso",
      message: "¿Deseas agregar producto a la mesa?",
      buttons: [{
        text: "sí",
        handler: () => {
          //  this.viewCtrl.dismiss({producto:obj});

          this.agregandoProducto(obj);
        }
      },
        "No"]
    });

    aviso.present();
  }


  public aparecerOpciones() {
    if (this.consulta) return;
    this.aparecerOpcionesBool = true;
  }

  public abrirSepararMesas() {
    this.aparecerComensales = true;
    this.desmoronarbool = false;
    this.desmoronaritems = false;

    this.arregloSeparar = {};

    for (let llave in this.arregloPedidoCliente) {
      this.arregloSeparar[llave] = [];
    }


    this.arregloaux = [];
    for (let item of this.detalle) {
      let obj = {};
      for (let llave in item) {
        obj[llave] = item[llave];
      }
      this.arregloaux.push(obj);
    }

  }

  public anadir(item, index) {

    let formarObj = {
      id_ticket: item.id_ticket,
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      observaciones: item.observaciones,
      nombre: item.nombre,
      ruta_imagen: '',
      servido: item.servido,
      notificacion: item.notificacion,
      precio: item.precio_unitario,
      copia: item.copia,
      indice: index
    };

    this.llave = "cliente" + this.comensalSeleccionado;
    this.arregloSeparar[this.llave].push(formarObj);



    this.detalle.splice(index, 1)

  }


  public eliminarRegresar(item, index) {
    this.detalle.splice(item.indice, 0, item);
    let arr = [];
    this.arregloSeparar[this.llave].splice(index, 1);
  }


  public seleccionarComensal() {
    let modal = this.modalCtrl.create(CuentaDetalleConfigPage, { total: this.intTotalComensales, activar: true });
    modal.present();
    modal.onDidDismiss(datos => {
      if (datos != undefined && datos != null) {

        this.comensalSeleccionado = datos.seleccionado.numero;
        this.llave = "cliente" + this.comensalSeleccionado;



        this.storage.set("totalComensales" + this.id_ticket, datos.total.length);
        let cambiar = false;
        if (this.intTotalComensales != datos.total.length) {
          cambiar = true;
        }
        this.intTotalComensales = datos.total.length;


        this.comensalSeleccionado = datos.seleccionado.numero;

        if (datos.total.length >= 2) {
          for (let x = 2; x <= datos.total.length; x++) {
            let llave = "cliente" + x;

            if (this.arregloPedidoCliente[llave] == undefined) {
              this.arregloPedidoCliente[llave] = [];
            }
          }
        }


        this.storage.set(this.objTicket.id_ticket, this.arregloPedidoCliente);
        if (cambiar == true) {
          this.abrirSepararMesas();
        }
      }
    });
  }


  public guardarCambiosComensales() {

    if (this.detalle.length != 0) {

      let toast = this.toastCtrl.create({ message: "Productos sin asignación, favor de asignarlo a algun comensal.", closeButtonText: "Entendido", showCloseButton: true });
      toast.present();
      return;
    }
    let alerta = this.alertctrl.create({
      subTitle: "¿Deseas separar cuentas con los cambios hechos?", buttons: [
        {
          text: "Si", handler: () => {
            for (let llave in this.arregloSeparar) {

              this.arregloPedidoCliente[llave] = [];
              let arregloaux = [];



              for (let x = 0; x < this.arregloSeparar[llave].length; x++) {
                let obj = {};
                for (let llave2 in this.arregloSeparar[llave][x]) {

                  obj[llave2] = this.arregloSeparar[llave][x][llave2];
                }

                obj["servido"] = true;

                arregloaux.push(obj);

              }
              this.arregloPedidoCliente[llave] = arregloaux;

              //Recuperando el detalle actual

              this.detalle = [];
              for (let item of this.arregloaux) {
                let obj = {};
                for (let llave in item) {
                  obj[llave] = item[llave];
                }
                this.detalle.push(obj);
              }
              //fin
            }


            this.aparecerOpcionesBool = false;
            this.aparecerComensales = false;

            this.storage.set(this.objTicket.id_ticket, this.arregloPedidoCliente);

          }
        }, "No"
      ]
    });

    alerta.present();
  }

  public apareceropc() {


    //Recuperando el detalle actual



    if (this.arregloaux != undefined) {
      this.detalle = [];
      for (let item of this.arregloaux) {
        let obj = {};
        for (let llave in item) {
          obj[llave] = item[llave];
        }
        this.detalle.push(obj);
      }
    }
    //fin
    this.aparecerOpcionesBool = false
    this.aparecerComensales = false;
    this.desmoronarbool = false;


  }


  public guardarCambiosObservaciones() {

    this.detalleobservaciones = false;
    this.agregandoProducto(this.objActual);
  }


  public cerrardetalleobservaciones() {
    this.detalleobservaciones = false;
    this.objActual.tiempo = "";
    this.objActual.observaciones = "";
  }


  public btnTiempos(numero) {
    let obj = this.objActual;
    let mensaje = "";
    switch (numero) {
      case 1:

        mensaje = "PRIMER TIEMPO";
        break;
      case 2:
        mensaje = "SEGUNDO TIEMPO";
        break;
      case 3:
        mensaje = "TERCER TIEMPO";
        break;
    }

    let alerta = this.alertctrl.create({
      subTitle: "¿Deseas agregar " + mensaje + " al producto?", buttons: [{
        text: "Si",
        handler: () => {
          obj.tiempo = mensaje;
          let toast = this.toastCtrl.create({ message: mensaje + " agregado correctamente", duration: 1500 });
          toast.present();
        }
      }, "No"]
    });

    alerta.present();
  }


  public agregandoObservacion(obj) {
    let mensaje = this.alertctrl.create({
      subTitle: "Agregar observaciones a la orden", message: "Las observaciones seran agregadas a la orden despues de agregar a la orden",
      inputs: [{ type: "text", placeholder: "Observaciones", name: "observaciones" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          obj.observaciones = datos.observaciones;
          let toast = this.toastCtrl.create({ message: "Observaciones agregada correctamente", duration: 1500 });
          toast.present();
        }
      }, "Cancelar"]
    });

    mensaje.present();
  }

  public btnObservacion() {
    this.agregandoObservacion(this.objActual);
  }



  public desmoronar() {

    this.desmoronarbool = true;
    this.aparecerComensales = false;
  }


  public aplicandodesmoronar(obj, indice) {
    if (this.aparecerComensales || this.desmoronaritems) {
      if (obj.copia == undefined) {
        if (obj.cantidad > 1) {
          obj.cantidad = obj.cantidad - 1;
          let objnuevo = {};
          for (let llave in obj) {
            objnuevo[llave] = obj[llave];
          }
          objnuevo["copia"] = true;
          objnuevo["cantidad"] = 1;
          objnuevo["indice"] = indice + 1;

          this.detalle.splice(indice + 1, 0, objnuevo)
        }
      } else {


        for (let x = indice - 1; x >= 0; x--) {
          if (this.detalle[x].copia == undefined && this.detalle[x].nombre.toLocaleLowerCase().includes(obj.nombre.toLocaleLowerCase())) {
            if (this.detalle[x].cantidad > 1) {
              obj.cantidad = obj.cantidad + 1;
              this.detalle[x].cantidad = this.detalle[x].cantidad - 1;
            }
            break;
          }
        }
      }
    }
  }

  public eliminarDesmoronar(obj, indice) {
    if (obj.copia != undefined) {

      let elimmm = false;

      for (let x = indice - 1; x >= 0; x--) {
        if (this.detalle[x].copia == undefined && this.detalle[x].nombre.toLocaleLowerCase().includes(obj.nombre.toLocaleLowerCase())) {
          this.detalle[x].cantidad = this.detalle[x].cantidad + obj.cantidad;
          break;
        } else {
          elimmm = true;
        }

      }


      this.detalle.splice(indice, 1);
      if (elimmm) {
        for (let llave in this.arregloSeparar) {
          for (let item of this.arregloSeparar[llave]) {
            if (item.nombre.toLocaleLowerCase().includes(obj.nombre.toLocaleLowerCase()) && item.copia == undefined) {
              item.cantidad = item.cantidad + obj.cantidad;
              break;
            }
          }
        }
      }
    }
  }


  public separarItems() {



    this.aparecerComensales = false;
    this.desmoronarbool = false;
    this.desmoronaritems = true;
  }


  public guardaritemsseparados() {
    this.aparecerComensales = false;
    this.aparecerOpcionesBool = false;
    this.desmoronarbool = false;
    this.desmoronaritems = false;




    this.ticketsPrd.separarItems(this.id_ticket, this.detalle).subscribe(datos => {
      this.detalle = [];
      this.cargandodetalle();
    });
  }


  public cargandodetalleOffline() {
    this.detalle = [];
    this.total = 0;


    for (let llave in this.arregloPedidoCliente) {
      let objsacar = this.arregloPedidoCliente[llave];
      for (let item of objsacar) {


        if (!item.servido) continue;

        if (item.cancelado == true) {
          item.cantidad = 0;
        }

        if (item.recalculado == undefined) {
          item.precio = item.cantidad * item.precio;
        }


        item.recalculado = true;

        this.total = this.total + (item.precio);
        if (this.servidosTodos == true) {
          if (item.servido == false) {
            this.servidosTodos = false;
          }
        }

        this.detalle.push(item);

      }
    }


    this.storage.set(this.objTicket.id_ticket, this.arregloPedidoCliente);

  }

  public cargandodetalle() {

    this.cargadoicon = true;
    this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
      this.cargadoicon = false;
      this.detalle = datos;
      console.log(this.detalle);
      this.total = 0;
      for (let item of datos) {
        if (item.cancelado == true) {
          item.cantidad = 0;
        }
        this.total = this.total + (item.precio);
        if (this.servidosTodos == true) {
          if (item.servido == false) {
            this.servidosTodos = false;
          }
        }
      }
    }, err => {
      let toast = this.toastCtrl.create({ message: "Error en traer detalle ticket, verifique internet", closeButtonText: "Entendido", showCloseButton: true });
      toast.present();
    });

  }


  public realizarAccion() {


    const actionSheet = this.actionshetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'accionshet',
      buttons: [
        {
          text: 'Cancelar',
          icon: "close",
          handler: () => {

            let nuevoArreglo = [];

            for (let item of this.detalle) {
              if (item.cancelado) {
                nuevoArreglo.push(item);
              }
            }

            this.ticketsPrd.cancelarDetalleTicketLista(nuevoArreglo).subscribe(datos => {
              let toas = this.toastCtrl.create({ message: "Lista de productos cancelado", duration: 1500 });
              toas.present();
              this.ticketsPrd.getTicketsDetalle(this.id_ticket).subscribe(datos => {
                this.detalle = datos;
                this.total = 0;
                for (let item of datos) {
                  if (item.cancelado == true) {
                    item.cantidad = 0;
                  }
                  this.total = this.total + (item.precio);
                  if (this.servidosTodos == true) {
                    if (item.servido == false) {
                      this.servidosTodos = false;
                    }
                  }
                }
              });
            });


            this.aparecerComensales = false;
            this.aparecerOpcionesBool = false;
            this.desmoronarbool = false;
            this.desmoronaritems = false;
          }
        }
      ]
    });
    actionSheet.present();

  }

}
