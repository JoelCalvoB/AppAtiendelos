import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, FabContainer, AlertController, ToastController, ModalController } from 'ionic-angular';
import { MesasProvider } from '../../providers/mesas/mesas';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasMesasPage } from '../cuentas-mesas/cuentas-mesas';
/**
 * Generated class for the MenuSubOrdenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-menu-sub-orden',
  templateUrl: 'menu-sub-orden.html',
})
export class MenuSubOrdenPage {

  public arreglo: any = [];
  public id_producto: any = 0;
  public boolCobrar:boolean = false;
  public boolCancelar:boolean = true;
  public id_sucursal;
  public id_usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private mesasPrd: MesasProvider,
    private usuariosPrd: UsuariosProvider, private alertaCtrl: AlertController, private tickPrd: TicketsProvider, private toastCtrl: ToastController,
  private modalCtrl:ModalController) {

   this.id_sucursal = usuariosPrd.getSucursal();
   this.id_usuario = usuariosPrd.getIdUsuario();
   this.id_producto = navParams.get("id_producto");

    mesasPrd.getActivosUsuarioEspecifico(this.id_sucursal,true,this.id_usuario).subscribe(datos => {
      this.arreglo = datos;
    });

    

  }




  public salir() {
    this.viewCtrl.dismiss();
  }

  public agregarCarrito(obj): any {

    let objTicket = {
      id_mesa: obj.id_mesa,
      id_sucursal: this.id_sucursal
    }

    this.tickPrd.getTicketEspecifico(objTicket).subscribe(datosTicket => {

      this.mensaje(datosTicket);

    });
    
  }

  public mensaje(objTicket){
  
    let a1 = this.alertaCtrl.create({
      title: "Aviso:",
      message: "Cantidad y observaciones",
      inputs: [
        {
          placeholder: "Cantidad",
          type: "number",
          name: "cant"
        },
        {
          placeholder: "Observaciones",
          type: "text", name: "observaciones"
        }]
      , buttons: [
        {
          text: "Agregar", handler: datos => {
            let id_ticket = objTicket.id_ticket;
            let id_producto = this.id_producto;
            let cantidad = datos.cant;
            let observaciones = datos.observaciones;
      
            let objDetalleTicket = {
              id_ticket:id_ticket,
              id_producto:id_producto,
              cantidad:cantidad,
              observaciones:observaciones
            }
      
            this.tickPrd.insertDetalle(objDetalleTicket).subscribe(datosDetalle => {
              let toast = this.toastCtrl.create({
                message:"Producto agregado a la mesa",
                duration:1500
              });
              toast.present();
              this.viewCtrl.dismiss();
            }
            );
          }
        }]
    });
    a1.present();
  }

  public agregar(){

  }

  public cobrar(){

  }

  public cancelar(){

  }

  public mesasDisponibles(){
      let modal = this.modalCtrl.create(CuentasMesasPage, { id_sucursal: this.id_sucursal });
      modal.present();
      modal.onDidDismiss(datos => {
        if(datos != undefined){
          let mesa = datos.mesa;
          let objMesa = {
            id_mesa: mesa.id_mesa,
            id_tipo: mesa.id_tipo,
            id_sucursal: mesa.id_sucursal,
            ocupada: true
          };
  
          this.mesasPrd.modificar(objMesa).subscribe(datosMesa => {
            mesa.ocupada = true;
            mesa.colorear = true;
            
            let obj = {
              idUser: this.id_usuario,
              idSucursal: this.id_sucursal,
              idMesa: mesa.id_mesa
            }
  
            
  
            this.tickPrd.insert(obj,false).subscribe(datosTicket => {
                this.mesasPrd.getActivosUsuarioEspecifico(this.id_sucursal,true,this.id_usuario).subscribe(datos =>{
                  this.arreglo = datos;
                });
            });
          });
        }
      });
  }

}
