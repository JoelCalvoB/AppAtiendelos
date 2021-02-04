import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ReportesProvider } from '../../providers/reportes/reportes';
/**
 * Generated class for the EstadisticaVentaxmesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@Component({
  selector: 'page-estadistica-ventaxmes',
  templateUrl: 'estadistica-ventaxmes.html',
})
export class EstadisticaVentaxmesPage {

  public FechaI;
  public FechaF;
  private arreglo: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private usuariosPrd: UsuariosProvider, public reportPrd:ReportesProvider) {
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
    var fecha = new Date();
    var ano = fecha.getFullYear();

  
    let lista = [["mes","sum"]];
    this.reportPrd.EstadisticaVentaPorMes().subscribe(datos=>{
       this.arreglo = datos;
        for(let item of this.arreglo){
          let mesletra= item.mes;

          switch (mesletra) {
            case 1:
            mesletra="Ene";
              break;
              case 2:
              mesletra="Feb";
              break;
              case 3:
              mesletra="Mar";
              break;
              case 4:
              mesletra="Abr";
              break;
              case 5:
              mesletra="May";
              break;
              case 6:
              mesletra="Jun";
              break;
              case 7:
              mesletra="Jul";
              break;
              case 8:
              mesletra="Ago";
              break;
              case 9:
              mesletra="Sep";
              break;
              case 10:
              mesletra="Oct";
              break;
              case 11:
              mesletra="Nov";
              break;
              case 12:
              mesletra="Dic";
              break;
              default:;
          }
   

         let lista2 = [mesletra,item.sum];
         lista.push(lista2);
        }
        var data = google.visualization.arrayToDataTable(lista);


        var options = {
          title: 'Ventas Mensuales',
          hAxis: {title: 'AÑO '+ano,  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          legend: 'none',
          width:'100%',
          height:'300px'
        };

        var chart = new google.visualization.AreaChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
  });
}

}
