import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ReportesProvider } from '../../providers/reportes/reportes';


declare var google;
/**
 * Generated class for the ProductoMasvendidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-producto-masvendido',
  templateUrl: 'producto-masvendido.html',
})
export class ProductoMasvendidoPage {

  public FechaI;
  public FechaF;
  private arreglo: any = [];
public nombre_;
public cantidad_;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private loadctrl: LoadingController,
    private usuariosPrd: UsuariosProvider, public reportPrd:ReportesProvider) {
  }

  ionViewDidLoad() {
    
  }


  public Grafica() {
    
   
      let fecha1 = this.FechaI;
      let fecha2 = this.FechaF;


      
      let obj = {
        FechaI: fecha1,
        FechaF: fecha2,
        id_sucursal: this.usuariosPrd.getSucursal()
      };


      let lista = [["productos","cantidad"]];
   this.reportPrd.EstadisticaMasVendido(obj).subscribe(datos=>{
      this.arreglo = datos;
       for(let item of this.arreglo){
        let lista2 = [item.nombre,item.conteo];
        lista.push(lista2);
       }

       var data = google.visualization.arrayToDataTable(lista);

       var options = {
         legend: 'none',
         pieSliceText: 'label',
         title: 'LO MÁS PEDIDO',
         pieStartAngle: 100,
         width:'100%',
         height:'300px'
       };
 
       var chart = new google.visualization.PieChart(document.getElementById('piechart'));
       chart.draw(data, options);
   });
    }
  }

  