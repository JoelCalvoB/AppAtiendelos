import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ReportesProvider } from '../../providers/reportes/reportes';
/**
 * Generated class for the EstadisticaMeseroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@Component({
  selector: 'page-estadistica-mesero',
  templateUrl: 'estadistica-mesero.html',
})

export class EstadisticaMeseroPage {
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


  
    let lista = [["nombre","total"]];
    this.reportPrd.EstadisticaVentaPorMesero(obj).subscribe(datos=>{
       this.arreglo = datos;
        for(let item of this.arreglo){
         let lista2 = [item.nombre,item.total];
         lista.push(lista2);
        }
        
        var data = google.visualization.arrayToDataTable(lista);


    var options = {
      title: 'VENTAS TOTALES POR MESERO',
      pieHole: 0.4,
      legend: 'none',
      width:'100%',
      height:'300px'
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  });
}
}

