import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';



@Component({
  selector: 'page-cuentas-resumen-pagar',
  templateUrl: 'cuentas-resumen-pagar.html',
})
export class CuentasResumenPagarPage {


  valor="E";

  cantidad = 0;
  private propina:Number = 0;

  public cantidad_pagar:number = 0;
  public disabled:boolean = false;


  public efectivo:boolean = false;
  public tarjetadcredito:boolean = false;

  public tipopropina = "P";
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl:ViewController,private alertCtrl:AlertController) {

      this.cantidad_pagar = this.navParams.get("cantidad_pagar");
  }

  ionViewDidLoad() {
    
  }

  public salir(){
    this.viewCtrl.dismiss();

  }

  public verificar():boolean{
    let valornuevo = this.cantidad;
    let valorExistente:string =  valornuevo+"";

    valorExistente = valorExistente.replace(/ /g,"");
    return valorExistente == "";
  }


  public tarjeta(){
    
    
    
    if(this.valor == "T"){
      this.cantidad = this.cantidad_pagar;
      this.disabled = true;
    }else{
      this.cantidad = 0;
      this.disabled = false;
    }

    return this.disabled;
  }

  public efectivometodo(){
    this.efectivo = true;
    this.tarjetadcredito = false;
  }

  public tarjetaaMetodo(){
    this.efectivo = false;
    this.tarjetadcredito = true;
  }


  public cobrar(cobrar){
    let alerta = this.alertCtrl.create({message:"¿Deseas realizar el cobro?",buttons:[{text:"Si",handler:()=>{
      let datos = {
        cantidad:cobrar.value,
        radio:this.valor,
        tipoPropina:(this.efectivo) ? "E":this.tipopropina,
        propina : this.propina
      }

      

      this.viewCtrl.dismiss(datos);
    }},"No"]});
    alerta.present();
  }

}
