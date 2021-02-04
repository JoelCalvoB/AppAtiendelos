import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { CuentasDetallePage } from '../cuentas-detalle/cuentas-detalle';
import { VentaseparadaScannerPage } from '../ventaseparada-scanner/ventaseparada-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { CuentasResumenPage } from '../cuentas-resumen/cuentas-resumen';
import { TicketsPage } from '../tickets/tickets';

/**
 * Generated class for the VentaseparadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-ventaseparada',
  templateUrl: 'ventaseparada.html',
})
export class VentaseparadaPage {
  public nuevo:boolean = false;
  public arreglo = [];

  public total = 0;
  public contador = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private globales:GlobalesProvider,private modalCtrl:ModalController,private barcodeScanner:BarcodeScanner,private toastCtrl:ToastController,
    private alertCtrl:AlertController,private usuarios:UsuariosProvider,private loadCtrl:LoadingController,private ticketPrd:TicketsProvider) {
  }

  ionViewDidLoad() {
    
    
  }


  public salir(){
    this.globales.cerrarAplicacion();
  }

  public buscar(){

    let modal = this.modalCtrl.create(CuentasDetallePage,{esVenta:true});
    modal.present();
    
    modal.onDidDismiss(datos =>{
      if(datos != undefined){
    
        datos.producto.id_ticket = 0;
        this.arreglo.push(datos.producto);
        this.total = 0;
        for(let item of this.arreglo){
            let tot = item.cantidad * item.precio;
            this.total = this.total + tot;
        }
      }
    });
  }


 public cobrar(){
   let mensaje = this.alertCtrl.create({message:"¿Deseas hacer el cobro?",buttons:[{text:"Si",handler:()=>{
    let obj = {
      idUser: this.usuarios.getIdUsuario(),
      idSucursal: this.usuarios.getSucursal(),
      idMesa: 0,
      nombre: " "
    }


    let mesasLoad = this.loadCtrl.create({content:"Haciendo el cobro"});
      mesasLoad.present();
 

      this.ticketPrd.insertAlias(obj).subscribe(datosTicket =>{
        for(let item of this.arreglo){
           item.id_ticket = datosTicket.id_ticket;
        }

        this.ticketPrd.insertDetalleLista(this.arreglo).subscribe(datos => {

          let modal = this.modalCtrl.create(CuentasResumenPage, { id_ticket: datosTicket.id_ticket });
          modal.present();
                 


          modal.onDidDismiss(datos => {
            if (datos) {      
             
              this.navCtrl.push(TicketsPage, { id_ticket: datos.id_ticket, billete: datos.billete });
      
              mesasLoad.dismiss();
            }
      
          });
        })

      });

   }},"No"]});
   mensaje.present();
 }


 public scanear(){
  this.barcodeScanner.scan().then(barcodeData => {
    
    let toast = this.toastCtrl.create({message:'Producto insertado con exito',duration:1500});
    toast.present();

    this.contador = this.contador + 1;
    let texto = barcodeData.text;

    let obj = {
       nombre:"Producto "+texto,
       cantidad:1,
       precio:10
    }

     this.arreglo.push(obj);
   }).catch(err => {
       
       let toast = this.toastCtrl.create({message:'Error al escanear: '+ err,closeButtonText:"Entendido",showCloseButton:true});
       toast.present();
    toast.present();
   });
 }

}
