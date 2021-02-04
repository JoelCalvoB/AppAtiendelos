import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, AlertController, PopoverController, LoadingController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { MesasProvider } from '../../providers/mesas/mesas';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasDetallePage } from '../cuentas-detalle/cuentas-detalle';
import { CuentasResumenPage } from '../cuentas-resumen/cuentas-resumen';
import { TicketsPage } from '../tickets/tickets';
import { Storage } from '@ionic/storage';
import { CuentaDetalleConfigMorePage } from '../cuenta-detalle-config-more/cuenta-detalle-config-more';
import { UsuariosActivosPage } from '../usuarios-activos/usuarios-activos';
import { CuentasMesasPage } from '../cuentas-mesas/cuentas-mesas';




@Component({
  selector: 'page-caja-mesa',
  templateUrl: 'caja-mesa.html',
})
export class CajaMesaPage {
  public id_sucursal;
  public arreglo: any = [];
  public menutogle: boolean = false;
  public boolCancelar: boolean = false;
  public boolCobrar: boolean = false;
  public indice;
  public id_usuario;
  public deslizar=false;
  public nombre_mesero:string = "";
  public numeroFolio = 0;
  public capitan:boolean = false;
  public detenerPeticion:boolean = false;
  public horaMesa:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private globales: GlobalesProvider,
    private usuariosPrd: UsuariosProvider, private mesasPrd: MesasProvider, private ticketsprd: TicketsProvider,
    private toasCtrl: ToastController, private modalCtrl: ModalController, private alertCtrl: AlertController,
    private storage: Storage,private poperCtrl:PopoverController,private loadCtrl:LoadingController,private TicketPrd:TicketsProvider) {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
     if(!this.usuariosPrd.getFree()){
      this.id_sucursal = this.usuariosPrd.getSucursal();
      this.id_usuario = this.usuariosPrd.getIdUsuario();
      this.capitan = this.usuariosPrd.getUsuario().capitan;
      this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, 0).subscribe(datos => {  
        for (let item of datos) {
          item.ocupada = true;
          item.colorear = true;
        }
        this.arreglo = datos;
      });
  
      this.menutogle = false;
  
  
      this.detenerPeticion  = false;
      this.verificacionTiempoReal();
     }else{
     }
  }

  ionViewWillLeave() {
     this.detenerPeticion  = true;

     this.deslizar = false;
    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;
  }


  ionViewWillUnload(){

    this.ionViewWillLeave();
    this.deslizar = false;
    this.menutogle = true;
    this.boolCancelar = false;
    this.boolCobrar = false;
  }

  public verificacionTiempoReal(){
  

    setTimeout(() => {
   
     if(!this.detenerPeticion){
       this.ticketsprd.getCantidadMesas(this.id_sucursal,0).subscribe(datos =>{

           if(datos.cantidad != this.arreglo.length){
             this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, 0).subscribe(datos => {
   
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
           }else{
             this.verificacionTiempoReal();
           }
       },err =>{
         let toast = this.toasCtrl.create({message:"Error al traer las notificaciones de mesas en tiempo real",closeButtonText:"Entendido",showCloseButton:true});
         toast.present();
       });
     }
    }, 1500);
   }



  public salir() {
    this.globales.cerrarAplicacion();
  }

  public marcar(indice) {
    for (let item of this.arreglo) {
      item.clase = false;
      item.colorear = item.ocupada;
    }

    this.arreglo[indice].colorear = false;
    this.arreglo[indice].clase = true;

    this.nombre_mesero = this.arreglo[indice].nombre_mesero;
    this.numeroFolio = this.arreglo[indice].id_folio;
    this.horaMesa = this.arreglo[indice].hora;

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
  }

  public agregar() {

    let idUser = this.usuariosPrd.getIdUsuario();
    let idSucursal = this.usuariosPrd.getSucursal();

    if (this.arreglo[this.indice].ocupada == true) {

      let objTicket = {
        id_mesa: this.arreglo[this.indice].id_mesa,
        id_sucursal: idSucursal
      }

      this.ticketsprd.getTicketEspecifico(objTicket).subscribe(datosTicket => {
        let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: datosTicket });
        modal.present();
        modal.onDidDismiss(datos => {
          if (datos) {
            this.arreglo[this.indice].ocupada = false;
            this.arreglo[this.indice].colorear = false;
            this.navCtrl.push(TicketsPage, { id_ticket: datos.id_ticket, billete: datos.billete });
          }
        });
      });
    } else {

      let objMesa = {
        id_mesa: this.arreglo[this.indice].id_mesa,
        id_tipo: this.arreglo[this.indice].id_tipo,
        id_sucursal: this.arreglo[this.indice].id_sucursal,
        ocupada: true
      };

      this.mesasPrd.modificar(objMesa).subscribe(datosMesa => {
        this.arreglo[this.indice].ocupada = true;
        this.arreglo[this.indice].colorear = true;

        let obj = {
          idUser: idUser,
          idSucursal: idSucursal,
          idMesa: this.arreglo[this.indice].id_mesa
        }

        this.ticketsprd.insert(obj, false).subscribe(datosTicket => {
          let modal = this.modalCtrl.create(CuentasDetallePage, { objTicket: datosTicket });
          modal.present();
        });
      });
    }
  }

  public cobrar() {

    let modal = this.modalCtrl.create(CuentasResumenPage, { id_ticket: this.arreglo[this.indice].id_ticket },{cssClass:'margen_modal'});
    modal.present();

    this.detenerPeticion = true;

    modal.onDidDismiss(datos => {
      if (datos) {
        this.arreglo[this.indice].ocupada = false;
        this.arreglo[this.indice].colorear = false;

        this.storage.remove(datos.id_ticket);
        this.storage.remove("totalComensales" + datos.id_ticket);
        this.navCtrl.push(TicketsPage, { id_ticket: datos.id_ticket, billete: datos.billete });

        this.deslizar = false;

      }

      this.detenerPeticion = false;
      this.menutogle = false;
      this.boolCancelar = false;
      this.boolCobrar = false;
      this.verificacionTiempoReal();
    });
  }

  public cancelar() {
    let alerta = this.alertCtrl.create({
      subTitle: "Aviso",
      message: "¿Deseas cancelar la cuenta?",
      buttons: [{
        text: "Sí", handler: () => {
          this.cancelando();
        }
      }, "No"]
    });
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
      this.arreglo[this.indice].ocupada = false;
      this.arreglo[this.indice].colorear = false;


      this.storage.remove(id_ticket);
      this.storage.remove("totalComensales" + id_ticket);

      this.arreglo.splice(this.indice, 1);

      this.menutogle = false;
      this.boolCancelar = false;
      this.boolCobrar = false;


      this.deslizar = false;
    });
  }


  public actualizando(refresher): any {

    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.ticketsprd.getActivosUsuarioEspecificoPorTicket(this.id_sucursal, 0).subscribe(datos => {

      for (let item of datos) {
        item.ocupada = true;
        item.colorear = true;
      }

      this.arreglo = datos;
      refresher.complete();
    });

    this.menutogle = false;
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
            let modal = this.modalCtrl.create(UsuariosActivosPage,{id_ticket:this.arreglo[this.indice].id_ticket});
            modal.present();
            modal.onDidDismiss(dat =>{
              if(dat != undefined){
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
          default:
        }
      }
    });
  }


  public realizarAccion(valor){
    let obj ={
      idTicket:this.arreglo[this.indice].id_ticket,
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
            let toas = this.toasCtrl.create({message:"Descuento aplicado",duration:1500});
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
            let toas = this.toasCtrl.create({message:"Descuento aplicado",duration:1500});
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
        let toas = this.toasCtrl.create({message:"Descuento aplicado",duration:1500});
        toas.present();
      });
    }
  
  }

  public autorizar(){
    let alerta = this.alertCtrl.create({message:"¿Deseas generar la llave de autorización?",
           buttons:[{text:"Si",handler:()=>{
            this.TicketPrd.establecerKey().subscribe(datos =>{
      
              let alerta2 = this.alertCtrl.create({subTitle:`La llave generada es: ${datos.password}`,buttons:["Entendido"]});
              alerta2.present();
            });
           }},"No"]});

           alerta.present();
  }

}
