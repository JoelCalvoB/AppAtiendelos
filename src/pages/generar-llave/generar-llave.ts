import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TicketsProvider} from '../../providers/tickets/tickets';

/**
 * Generated class for the GenerarLlavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-generar-llave',
  templateUrl: 'generar-llave.html',
})
export class GenerarLlavePage {

  public llave: any ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public TicketPrd:TicketsProvider) {
  }

   public genera()
  {
     this.TicketPrd.establecerKey().subscribe(datos =>{
      
       this.llave = datos.password;
      
     });
  
  }

  ionViewDidLoad() {
    

    
  }

 
}
