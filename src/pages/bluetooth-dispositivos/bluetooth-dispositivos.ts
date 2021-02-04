import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Storage } from '@ionic/storage';





@Component({
  selector: 'page-bluetooth-dispositivos',
  templateUrl: 'bluetooth-dispositivos.html',
})
export class BluetoothDispositivosPage {

  public arreglo: any = [];
  public tipo;
  public aparecer;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bt: BluetoothSerial, private loadCtrl: LoadingController, private storage: Storage,
    private viewCtrl: ViewController,private toasCtrl:ToastController) {
  }

  ionViewDidLoad() {

    this.aparecer = this.navParams.get("aparecer");


    let cargando = this.loadCtrl.create({ content: "Cargando" });
    cargando.present();
    this.bt.list().then(datos => {
      this.arreglo = datos;
      cargando.dismiss();
    }).catch(err => {
      cargando.dismiss();
    });

    this.tipo = this.navParams.get("tipo");
  }


  public conectar(obj) {

    let cargando = this.loadCtrl.create({ content: "Conectando a impresora" });
    cargando.present();
    let objblue = {
      mac: obj.address,
      conectar: true
    }
    this.storage.set(this.tipo, objblue);


    this.bt.connect(obj.address).subscribe(datos => {
      cargando.dismiss();
      let mensajeConectado = `DISPOSITIVO SE CONECTO A LA IMPRESORA DE TIPO ${this.tipo}\n\n\n`;
      this.bt.write(mensajeConectado).then(escribio => {
        this.bt.disconnect();
        if(this.aparecer == true){
          this.viewCtrl.dismiss(true);
        }else{
          this.navCtrl.pop();
        }

  
      });
      
    }, err => {
      let toas = this.toasCtrl.create({message:"Error al conectar a la impresora",duration:1500});
      toas.present();
      cargando.dismiss();
    });
  }

  public actualizando(refresher): any {


    this.bt.list().then(datos => {
      this.arreglo = datos;
      refresher.complete();
    }).catch(err => {
      refresher.complete();
    });
  }


  public salir() {
    this.viewCtrl.dismiss();
  }


  public realizado() {
    this.viewCtrl.dismiss(true);
  }

}
