import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { direcciones } from '../../assets/direcciones';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';



declare var Stripe:any;
/**
 * Generated class for the StripePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {
  myForm: FormGroup;

  public direccion="";
  public mount:any;
  public boton: string = "";
private variable;
private arreglo: any = [];



  constructor(public navCtrl: NavController,     private toasCtrl:ToastController,     private parametros: NavParams,public formBuilder: FormBuilder, public navParams: NavParams , private http: HttpClient) {

    this.direccion = direcciones.payment();

    this.variable = this.parametros.get("parametro");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { nombre: "" }
      this.boton="AUTORIZAR";
      this.myForm = this.createMyForm(obj);
    } 
  }

  ionViewDidLoad() {
    
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      cardNumber:[obj.nombre, Validators.required],
      expMonth:[obj.nombre, Validators.required],
      expYear:[obj.nombre, Validators.required],
      cvc:[obj.nombre, Validators.required],
      mount:[obj.nombre, Validators.required]
    });
  }


  chargeCard(token: string,monto) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    let jsonEnviar = {'token': token, 'amount': monto};

    let json = JSON.stringify(jsonEnviar);

    
    let direccion= this.direccion
    this.http.post(direccion +'/charge', json, httpOptions)
      .subscribe(resp => {
        this.arreglo=resp;
         let mensaje= this.arreglo.get("seller_message");
         
        let toas = this.toasCtrl.create({message:"Procesando Pago",duration:1500});
        toas.present();
      });
    

  }

  chargeCreditCard() {
    let form = document.getElementsByTagName("form")[0];
    let obj = this.myForm.value;
    
    let number= obj.cardNumber;
    let expMonth=obj.expMonth;
    let expYear=obj.expYear;
    let cvc= obj.cvc;
    

    
    Stripe.card.createToken({
      number: number,
      expMonth: expMonth,
      exp_year: expYear,
      cvc: cvc
    }, 
    
    (status: number, response: any) => {
      if (status === 200) {
        let token = response.id;
        this.chargeCard(token,obj.mount);
      } else {
        
      }
    });
  }

}
