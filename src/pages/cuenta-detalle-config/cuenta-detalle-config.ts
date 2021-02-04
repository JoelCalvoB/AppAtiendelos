import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer } from '@ionic-native/file-transfer';
import { UsuariosPage } from '../usuarios/usuarios';
import { CuentaDetalleConfigMorePage } from '../cuenta-detalle-config-more/cuenta-detalle-config-more';
import { UsuariosActivosPage } from '../usuarios-activos/usuarios-activos';
import { CuentasMesasPage } from '../cuentas-mesas/cuentas-mesas';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TicketsProvider } from '../../providers/tickets/tickets';






@Component({
  selector: 'page-cuenta-detalle-config',
  templateUrl: 'cuenta-detalle-config.html',
})
export class CuentaDetalleConfigPage {

  public comensales: number = 1;
  public arreglo = [{ numero: 1, colorear: false }];
  public btn = true;
  public indice = 0;
  public id_ticket;
  public id_sucursal;
  public desactivar:boolean = false;
  public titulo:string="Configuración de la mesa";
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private poperCtrl: PopoverController, private alertCtrl: AlertController, private modal: ModalController,
    private usuariosPrd: UsuariosProvider, private loadCtrl: LoadingController, private ticketsprd: TicketsProvider,
  private toastCtrl:ToastController) {

    this.id_sucursal = usuariosPrd.getSucursal();
  }

  ionViewDidLoad() {
    this.comensales = this.navParams.get("total");
    this.id_ticket = this.navParams.get("id_ticket");
    this.desactivar = this.navParams.get("activar");

    this.desactivar = this.desactivar == undefined ? false:this.desactivar;

     if(this.desactivar){
        this.titulo = "Seleccionar comensal";
     }

    this.agregar();

  }

  public salir() {
    this.viewCtrl.dismiss();

  }

  public agregar() {
    let array = [];
   
    for (let x = 1; x <= this.comensales; x++) {
      array.push({ numero: x, colorear: false });
    }

    this.arreglo = array;

  }


  public marcar(item, index) {

    for (let i of this.arreglo) {
      i.colorear = false;
    }


    index.colorear = true;

    this.btn = false;


    this.indice = item;
  }

  public confirmar() {
    this.viewCtrl.dismiss({ seleccionado: this.arreglo[this.indice], total: this.arreglo });
  }


  public configuracion() {
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
            let modal = this.modal.create(UsuariosActivosPage, { id_ticket: this.id_ticket });
            modal.present();
            modal.onDidDismiss(dat => {
              if (dat != undefined) {
                this.viewCtrl.dismiss(1);
              }
            });
            break;
          case 3:
            let modal3 = this.modal.create(CuentasMesasPage, { id_sucursal: this.id_sucursal });
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
                    idTicket: this.id_ticket,
                    idMesa: mesa.id_mesa,
                    nombre: `${tipo} ${mesa.id_mesa}`
                  }



                  this.ticketsprd.cambiarMesa(obj, datos.unir).subscribe(datosTicket => {
                    mesasLoad.dismiss();
                    this.viewCtrl.dismiss(1);
                  }, err => {
                    mesasLoad.dismiss();
                  });
                } else {//***Aqui se unen las mesas */
                  let mesa = datos.mesa;
                  let obj = {
                    idTicket: this.id_ticket,
                    idMesa: mesa.id_mesa,
                    nombre: mesa.nombre,
                    mesasAfectadas: mesa.mesasAfectadas
                  }


                  this.ticketsprd.cambiarMesa(obj, datos.unir).subscribe(datosTicket => {
                    mesasLoad.dismiss();
                    this.viewCtrl.dismiss(1);

                  }, erro => {
                    mesasLoad.dismiss();
                  });

                }
              }
            });


            break;
          default:
        }
      }
    });
  }


  public realizarAccion(valor){
 

    let obj ={
      idTicket:this.id_ticket,
      cortesia:valor,
      efectivo_porcentaje:0
    }

    if(valor == 1){

      let mensaje = this.alertCtrl.create({
        message:"Efectivo a descontar",
        inputs:[{type:"number",name:"efectivo",value:"0",placeholder:"Efectivo"}],
        buttons:[{text:"Aceptar",handler:dat =>{
          obj.efectivo_porcentaje = dat.efectivo;
          let aplicando = this.loadCtrl.create({content:"Aplicando descuento"});
          aplicando.present();
          this.ticketsprd.aplicandoDescuento(obj).subscribe(datos =>{
            aplicando.dismiss();
            let toas = this.toastCtrl.create({message:"Descuento aplicado",duration:1500});
            toas.present();
          });
        }},"Cancelar"]
      });
      mensaje.present();
    }else if(valor == 2){
      let mensaje = this.alertCtrl.create({
        message:"Porcentaje a descontar",
        inputs:[{type:"number",name:"efectivo",value:"0",placeholder:"Porcentaje"}],
        buttons:[{text:"Aceptar",handler:dat =>{
          obj.efectivo_porcentaje = dat.efectivo;
          let aplicando = this.loadCtrl.create({content:"Aplicando descuento"});
          aplicando.present();
          this.ticketsprd.aplicandoDescuento(obj).subscribe(datos =>{
            aplicando.dismiss();
            let toas = this.toastCtrl.create({message:"Descuento aplicado",duration:1500});
            toas.present();
          });
        }},"Cancelar"]
      });
      mensaje.present();
    }else{
      obj.efectivo_porcentaje = 0;
      let aplicando = this.loadCtrl.create({content:"Aplicando descuento"});
      aplicando.present();
      this.ticketsprd.aplicandoDescuento(obj).subscribe(datos =>{
        aplicando.dismiss();
        let toas = this.toastCtrl.create({message:"Descuento aplicado",duration:1500});
        toas.present();
      });
    }
  
  }

}
