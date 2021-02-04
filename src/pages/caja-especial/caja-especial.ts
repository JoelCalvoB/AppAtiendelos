import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { templateJitUrl } from '@angular/compiler';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { direcciones } from '../../assets/direcciones';
import { ReportesProvider } from '../../providers/reportes/reportes';




/**
 * Generated class for the CajaEspecialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-caja-especial',
  templateUrl: 'caja-especial.html',
})
export class CajaEspecialPage {
  public arreglo: any = [];
  public fecha;
  public id_sucursal;
  public id_empresa;
  public conjunto:string = "";
  constructor(public navCtrl: NavController, private toasCtrl: ToastController, public loadingCtrl: LoadingController,
    private usuariosPrd: UsuariosProvider, private reportePrd: ReportesProvider, private iab: InAppBrowser, public navParams: NavParams, private globales: GlobalesProvider, private ticktPrd: TicketsProvider) {
    this.id_sucursal = usuariosPrd.getSucursal();

  }


  public salir() {
    this.globales.cerrarAplicacion();
  }


  public buscar() {

    this.ticktPrd.GetDesgloseCajaEspecial(this.id_sucursal, this.fecha).subscribe(datos => {
      this.arreglo = datos;
      for (let item of this.arreglo) {
        item.seleccionado = false;
      }
    });
  }


  public eliminar() {

    this.ticktPrd.DeleteDesgloseCajaEspecial(this.id_sucursal, this.fecha).subscribe(datos => {
    
    });
  }


  public hecho() {
    let arreglobueno = [];
    for (let item of this.arreglo) {
      if (item.seleccionado) {
        arreglobueno.push(item);
      }
    }
    for (let i of arreglobueno) {
       
      this.conjunto = this.conjunto +i.id_ticket+",";
      
    }

    

    this.conjunto = this.conjunto.substring(0,this.conjunto.length-1);


 

    let auxFecha = "";

    if (this.fecha == undefined) {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; //January is 0!
      let yyyy = today.getFullYear();
      let dia: string = "";
      let mes: string = "";

      if (dd < 10) {
        dia = "0" + dd;
      } else {
        dia = "" + dd;
      }

      if (mm < 10) {
        mes = '0' + mm;
      } else {
        mes = "" + mm;
      }

      auxFecha = yyyy + '-' + mes + '-' + dia;
    } else {
      auxFecha = this.fecha;
    }

    let obj: any;
    obj =
    {
      listac: this.conjunto,
      id_sucursal: this.id_sucursal,
      fechaInserta: auxFecha
    }
    this.ticktPrd.CorteCaja(obj).subscribe(datos => {
      let toas = this.toasCtrl.create({ message: "Registro actualizado correctamente", duration: 2500 });
      toas.present();
    });


    this.ticktPrd.GetDesgloseCajaEspecial(this.id_sucursal, this.fecha).subscribe(datos => {
      this.arreglo = datos;
      for (let item of this.arreglo) {
        item.seleccionado = false;
      }

      const loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      loader.present();


    });


    let fecha1 = this.fecha;
    this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/corteespecial/${this.id_sucursal}/fechas/${fecha1}`, "_system");



  this.conjunto="";


  }





}





