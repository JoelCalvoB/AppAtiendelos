import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { CuentasDetalleProductosPage } from '../cuentas-detalle-productos/cuentas-detalle-productos';
import { CuentasDetalleAntesdeenviarPage } from '../cuentas-detalle-antesdeenviar/cuentas-detalle-antesdeenviar';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { GlobalesProvider } from '../../providers/globales/globales';


@Component({
  selector: 'page-cuentas-detalle-subcategoria',
  templateUrl: 'cuentas-detalle-subcategoria.html',
})
export class CuentasDetalleSubcategoriaPage {

  public arreglo = [];
  public metodo;
  public objticket;
  public insertarDetalleConsumidor;
  public comensalSeleccionado;
  public arregloPedidoCliente;
public esVenta:boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private modalCtrl: ModalController, private ticketPrd: TicketsProvider,private usuariosPrd:UsuariosProvider,private globales:GlobalesProvider) {
    this.arreglo = navParams.get("arreglo");

    this.metodo = navParams.get("metodo");
    this.objticket = navParams.get("objticket");

     this.esVenta = this.objticket == undefined;

    this.insertarDetalleConsumidor = navParams.get("insertarDetalleConsumidor");
    this.comensalSeleccionado = navParams.get("comensalSeleccionado");
    this.arregloPedidoCliente = navParams.get("arregloPedidoCliente");

  }

  ionViewDidLoad() {
    
  }


  public detenerPeticion: boolean = false;
  public cerrado: boolean = false;
  ionViewWillLeave() {
    
    this.detenerPeticion = true;
    
  }


  ionViewWillUnload() {

    if(!this.esVenta){
      this.ionViewWillLeave();
    }
  }

  public verificacionTiempoReal() {

  if(!this.usuariosPrd.getFree() && !this.globales.isSemiOnline()){
    if(!this.esVenta){

      setTimeout(() => {
     
        if (!this.detenerPeticion) {
          this.ticketPrd.getTicketActivo(this.objticket.id_ticket).subscribe(datos => {
            
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
  }

  ionViewDidEnter() {
    if(!this.esVenta){
      this.verificacionTiempoReal();
    }
  }



  public seleccionar(obj) {

    if (obj.submenu != true) {
      let modal = this.modalCtrl.create(CuentasDetalleProductosPage, {
        arreglo: obj.productos, metodo: this.metodo, objticket: this.objticket, insertarDetalleConsumidor: this.insertarDetalleConsumidor,
        comensalSeleccionado: this.comensalSeleccionado, arregloPedidoCliente: this.arregloPedidoCliente
      });
      modal.present();
      modal.onDidDismiss(servido => {
       if(!this.esVenta){
        this.detenerPeticion = false;
        this.verificacionTiempoReal();
        if (servido != null && servido != undefined) {
          if (servido == true) {
              this.viewCtrl.dismiss(true);
          } else {
            if (servido.servido == true) {
              this.viewCtrl.dismiss(servido);
            }
          }
        }
       }else{
          this.viewCtrl.dismiss(servido);
       }
      });

    } else {
      let modal = this.modalCtrl.create(CuentasDetalleSubcategoriaPage, {
        arreglo: obj.submenu_array, metodo: this.metodo, objticket: this.objticket, insertarDetalleConsumidor: this.insertarDetalleConsumidor,
        comensalSeleccionado: this.comensalSeleccionado, arregloPedidoCliente: this.arregloPedidoCliente
      });
      modal.present();
      modal.onDidDismiss(servido => {
        if(!this.esVenta){
          this.detenerPeticion = false;
          this.verificacionTiempoReal();
          if (servido != null && servido != undefined) {
            if(servido == true){
  
              this.viewCtrl.dismiss(true);
            }else{
              if (servido.servido == true) {
                this.viewCtrl.dismiss(servido);
              }
            }
          }
        }else{
          this.viewCtrl.dismiss(servido)
        }
      });
    }
  }

  public salir() {
    this.viewCtrl.dismiss();
  }



  public verCuenta() {

    let ventana = this.modalCtrl.create(CuentasDetalleAntesdeenviarPage, { arreglo: this.arregloPedidoCliente, id_mesa: this.objticket.nombre, id_ticket: this.objticket.id_ticket, id_folio: this.objticket.id_folio },{cssClass:'margen_modal'});
    ventana.present();

    ventana.onDidDismiss(servido => {
      this.detenerPeticion = false;
      this.verificacionTiempoReal();
      if (servido != null && servido != undefined) {
        if (servido.servido == true) {
          this.viewCtrl.dismiss(servido);
        }
      }
    });
  }

}
