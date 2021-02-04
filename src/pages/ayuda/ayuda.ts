import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the AyudaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-ayuda',
  templateUrl: 'ayuda.html',
})
export class AyudaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private iab:InAppBrowser) {
  }

  ionViewDidLoad() {
  }


  public ir(){
    this.iab.create(`https://atiendelosrestaurant.000webhostapp.com/`,"_system");

  }

}
