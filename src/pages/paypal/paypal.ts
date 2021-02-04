import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PayPal,PayPalPayment,PayPalConfiguration,PayPalPaymentDetails} from '@ionic-native/paypal';
/**
 * Generated class for the PaypalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-paypal',
  templateUrl: 'paypal.html',
})
export class PaypalPage {

  monto_pago:string;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    private Paypal:PayPal ) {
  
  }
  ionViewDidLoad() {
    
  }
  currency: string = 'MXN';
  currencyIcon: string = '$';

  comprar() {
    
    this.Paypal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox:'AUU1B2onVES3IpGeHO_ap2G389JEKpTFdPXL84ndX9kCl_j3sORMw81ZJGE6gKlp7gDsMhSh-kK8D9SH'

    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.Paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards:true,

      })).then(() => {
        let payment = new PayPalPayment(this.monto_pago, this.currency, 'Consumo de Alimentos', 'Cobro');
        this.Paypal.renderSinglePaymentUI(payment).then((res) => {
          
          // Successfully paid

          // Example sandbox response
          //   jocalburieu@gmail.com    j01408220394eve
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          
        });
      }, () => {
        
      });
    }, () => {
    
    });
  }
}