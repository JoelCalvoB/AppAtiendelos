import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { CuentasDetalleAntesdeenviarPage } from '../cuentas-detalle-antesdeenviar/cuentas-detalle-antesdeenviar';
import { Storage } from '@ionic/storage';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { GlobalesProvider } from '../../providers/globales/globales';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

/**
 * Generated class for the CuentasDetalleProductosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-cuentas-detalle-productos',
  templateUrl: 'cuentas-detalle-productos.html',
})
export class CuentasDetalleProductosPage {

  public arreglo: any = [];
  public arregloBusqueda: any = [];
  public buscar: boolean = false;
  public metodo;
  public objTicket;
  public insertarDetalleConsumidor;
  public comensalSeleccionado;
  public arregloPedidoCliente;
  public letras: string = "";

  public mostrarOpciones: boolean = false;
  public objActual;

  public esVenta:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private modalCtrl: ModalController, private storage: Storage,
  private ticketPrd:TicketsProvider,private globales:GlobalesProvider,private usuariosPrd:UsuariosProvider) {
    this.arreglo = navParams.get("arreglo");
    this.arregloBusqueda = navParams.get("arreglo");
    this.metodo = navParams.get("metodo");
    this.insertarDetalleConsumidor = navParams.get("insertarDetalleConsumidor");
    this.comensalSeleccionado = navParams.get("comensalSeleccionado");
    this.arregloPedidoCliente = navParams.get("arregloPedidoCliente");
    this.objTicket = navParams.get("objticket");


    this.esVenta = this.objTicket == undefined;
  }

  ionViewDidLoad() {
    
  }

  public detenerPeticion:boolean = false;
  public cerrado:boolean = false;
    ionViewWillLeave() {
      
       this.detenerPeticion  = true;
       
    }
  
  
    ionViewWillUnload(){
  
      if(!this.esVenta){
        this.ionViewWillLeave();
      }
    }
  
    public verificacionTiempoReal(){
    
  
      

      if(!this.globales.isSemiOnline() && !this.usuariosPrd.getFree()){
        if(!this.esVenta){
          setTimeout(() => {
          
           if(!this.detenerPeticion){
             this.ticketPrd.getTicketActivo(this.objTicket.id_ticket).subscribe(datos =>{
                       this.verificacionTiempoReal();
             },err =>{
                if(!this.cerrado){
                  this.cerrado = true;
                  this.viewCtrl.dismiss(true);
                }
             });
           }
          }, 1500);
       
           
        }
      }


     }
  
     ionViewDidEnter(){
       if(!this.esVenta){
        this.verificacionTiempoReal();
       }
     }
  
  
  


  public salir() {
    this.viewCtrl.dismiss();
  }

  public getcantidad(indice): any {
    return this.arreglo[indice].cantidad;
  }

  public restar(indice): any {
    let cantidad = this.arreglo[indice].cantidad;
    if (cantidad == 1)
      cantidad = 1;
    else
      cantidad = cantidad - 1;

    this.arreglo[indice].cantidad = cantidad;
  }

  public sumar(indice): any {
    let cantidad = this.arreglo[indice].cantidad;
    cantidad = cantidad + 1;
    this.arreglo[indice].cantidad = cantidad;

  }


  public addMesa(obj) {
    obj.tiempo = "";
   let today=new Date();
    var h=today.getHours();

    var  m=today.getMinutes();

     var s=today.getSeconds();
obj.hora = h+':'+m +':'+s;
   
    if(obj.tipo_menudesplegable == "descriptivo" || obj.tipo_menudesplegable == "cantidad"){
      let objmenu = obj.lista_menudesplegable;
      let checado : boolean = true;
      let listaRadios = [];
      for(let item of objmenu){

         let auxobj1 = {label:item.nombre,name:item.nombre,type:'checkbox',value:item.nombre,checked:checado}
         checado = false;

        listaRadios.push(auxobj1);
      }
      let aviso = this.alertCtrl.create({
        subTitle: "Aviso",
        message: "¿Seleccionar opción del menú?",
        inputs:listaRadios,
        buttons: [{
          text: "sí",
          handler: (datos) => {
     
            obj.observaciones = obj.observaciones == undefined || obj.observaciones == null ? "":obj.observaciones;
            for(let itemcheck of datos){
                obj.observaciones = obj.observaciones + itemcheck+",";
            }
            obj.observaciones = obj.observaciones.substring(0,obj.observaciones.length - 1);
            if(!this.esVenta){
              
              this.metodo(obj);
              obj.observaciones = "";
            }else{
              
              this.viewCtrl.dismiss({producto : obj});
            }
          }
        },
          "No"]
      });
  
      aviso.present();

    }else{

      let aviso = this.alertCtrl.create({
        subTitle: "Aviso",
        message: "¿Deseas agregar producto a la mesa?",
        buttons: [{
          text: "sí",
          handler: () => {
            if(!this.esVenta){
              this.metodo(obj);
              console.log(obj);
            }else{
              this.viewCtrl.dismiss({producto : obj});
            }
          }
        },
          "No"]
      });
  
      aviso.present();
    }

 
  }

  public mostrarOpcionesMetod(obj) {
    this.objActual = obj;
    this.mostrarOpciones = true;
  }



  public buscarActivando() {
    this.buscar = true;
  }

  public verCuenta() {

    let ventana = this.modalCtrl.create(CuentasDetalleAntesdeenviarPage, { arreglo: this.arregloPedidoCliente, id_mesa: this.objTicket.nombre,id_ticket :this.objTicket.id_ticket ,id_folio:this.objTicket.id_folio},{cssClass:'margen_modal'});
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


  public getItems(evento) {
    this.arreglo = this.arregloBusqueda.filter(obj => obj.nombre.toLocaleLowerCase().includes(this.letras.toLocaleLowerCase()));
  }

  public regresar() {
    this.mostrarOpciones = false;
    this.objActual.tiempo = "";
    this.objActual.observaciones = "";
  }


  public agregandoObservacion(obj) {
    let mensaje = this.alertCtrl.create({
      subTitle: "Agregar observaciones a la orden", message: "Las observaciones seran agregadas a la orden despues de agregar a la orden",
      inputs: [{ type: "text", placeholder: "Observaciones", name: "observaciones" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          obj.observaciones = datos.observaciones;
          let toast = this.toastCtrl.create({message:"Observaciones agregada correctamente",duration:1500});
          toast.present();
        }
      }, "Cancelar"]
    });

    mensaje.present();
  }

  public btnObservacion() {
    this.agregandoObservacion(this.objActual);
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

    let alerta = this.alertCtrl.create({
      subTitle: "¿Deseas agregar " + mensaje + " al producto?", buttons: [{
        text: "Si",
        handler: () => {
          obj.tiempo = mensaje;
          let toast = this.toastCtrl.create({message:mensaje+" agregado correctamente",duration:1500});
          toast.present();
        }
      }, "No"]
    });

    alerta.present();
  }


  public aceptar(){

    if(this.objActual.tipo_menudesplegable == "descriptivo" || this.objActual.tipo_menudesplegable == "cantidad"){
      let objmenu = this.objActual.lista_menudesplegable;
      let checado : boolean = true;
      let listaRadios = [];
      for(let item of objmenu){

         let auxobj1 = {label:item.nombre,name:item.nombre,type:'checkbox',value:item.nombre,checked:checado}
         checado = false;

        listaRadios.push(auxobj1);
      }
      let aviso = this.alertCtrl.create({
        subTitle: "Aviso",
        message: "¿Seleccionar opción del menú?",
        inputs:listaRadios,
        buttons: [{
          text: "sí",
          handler: (datos) => {
            this.objActual.observaciones = this.objActual.observaciones == undefined || this.objActual.observaciones == null ? "":this.objActual.observaciones;
            for(let itemcheck of datos){
              this.objActual.observaciones = this.objActual.observaciones + itemcheck+",";
            }
            this.objActual.observaciones = this.objActual.observaciones.substring(0,this.objActual.observaciones.length - 1);
            if(!this.esVenta){
              this.metodo(this.objActual);
              this.objActual.observaciones = "";
            }else{
              this.viewCtrl.dismiss({producto : this.objActual});
            }
          }
        },
          "No"]
      });
  
      aviso.present();

    }else{
      this.metodo(this.objActual);

    }


     
     this.mostrarOpciones = false;
  }
}
