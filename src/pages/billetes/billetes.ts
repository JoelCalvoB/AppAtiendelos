import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the BilletesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-billetes',
  templateUrl: 'billetes.html',
})
export class BilletesPage {


  private caja:number = 0;
  private mil:number = 0;
  private quinientos:number = 0;
  private docientos:number = 0;
  private cien:number = 0;
  private cincuenta:number = 0;
  private veinte:number = 0;
  private diez:number = 0;
  private cinco:number = 0;
  private dos:number = 0;
  private uno:number = 0;
  private centavo:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
  private alertCtrl:AlertController,private storage:Storage,private toast:ToastController) {
  }

  ionViewDidLoad() {
    this.caja = this.navParams.get("caja");
    this.storage.get("billetes").then(billete =>{
       if(billete != undefined && billete != null){
          this.mil = billete.mil;
          this.quinientos = billete.quinientos;
          this.docientos = billete.docientos;
          this.cien = billete.cien;
          this.cincuenta = billete.cincuenta;
          this.veinte = billete.veinte;
          this.diez = billete.diez;
          this.cinco = billete.cinco;
          this.dos = billete.dos;
          this.uno = billete.uno;
          this.centavo = billete.centavo;
       }
    });
  }

  public realizar(){
    let alerta = this.alertCtrl.create({message:"¿Deseas ingresar los billetes?",buttons:[{text:"Si",handler:()=>{
      let objBilletes = {
        mil:this.mil,
        quinientos:this.quinientos,
        docientos:this.docientos,
        cien:this.cien,
        cincuenta:this.cincuenta,
        veinte:this.veinte,
        diez:this.diez,
        cinco:this.cinco,
        dos:this.dos,
        uno:this.uno,
        centavo:this.centavo
      };
          this.storage.set("billetes",objBilletes);

          let toast = this.toast.create({message:"Billetes guardado con exito",duration:1500});
          toast.present();
    }},"No"]});
    alerta.present();
  }

  public salir(){
    this.viewCtrl.dismiss();
  }

  public obtenerBillete():number{
    return Number(this.mil)*1000+
           Number(this.quinientos)*500+
           Number(this.docientos)*200+
           Number(this.cien)*100+
           Number(this.cincuenta)*50+
           Number(this.veinte)*20+
           Number(this.diez)*10+
           Number(this.cinco)*5+
           Number(this.dos)*2+
           Number(this.uno)*1+
           Number(this.centavo)*0.5;
  }

  public obtenerDiferencia():number{
    return Number(this.caja)-(Number(this.mil)*1000+
    Number(this.quinientos)*500+
    Number(this.docientos)*200+
    Number(this.cien)*100+
    Number(this.cincuenta)*50+
    Number(this.veinte)*20+
    Number(this.diez)*10+
    Number(this.cinco)*5+
    Number(this.dos)*2+
    Number(this.uno)*1+
    Number(this.centavo)*0.5);
  }


  

}
