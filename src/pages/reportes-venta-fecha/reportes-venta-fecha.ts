import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController ,ViewController} from 'ionic-angular';
import { ReportesProvider } from '../../providers/reportes/reportes';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { direcciones } from '../../assets/direcciones';
import { InAppBrowser } from '@ionic-native/in-app-browser';



@Component({
  selector: 'page-reportes-venta-fecha',
  templateUrl: 'reportes-venta-fecha.html',
})
export class ReportesVentaFechaPage {

  public f1;
  public f2;

  public nombrereporte;
  public opcion = "";
  public esmodal:boolean = false;

  public url = direcciones.reportes;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private reportePrd: ReportesProvider, private loadctrl: LoadingController,
    private usuariosPrd: UsuariosProvider,private iab:InAppBrowser,private viewCtrl:ViewController) {

    this.nombrereporte = this.navParams.get("nombre_reporte");
    this.opcion = this.navParams.get("opcion");
    this.esmodal = this.navParams.get("esmodal");
    this.esmodal = this.esmodal == undefined ? false:this.esmodal;
  }

  ionViewDidLoad() {

  }


  public salir() {
      this.viewCtrl.dismiss();

  }




  public reporte() {

    
    let mensaje = this.alertCtrl.create({
      message: "Visualización del reporte", inputs: [{
        type: "radio",
        checked: true,
        value: "1",
        label: "Pdf"
      }, {
        type: "radio",
        value: "2",
        label: "Correo electrónico"
      }], buttons: [{
        text: "Aceptar", handler: dato => {
          let cargando = this.loadctrl.create({ content: "Descargando reporte" });
          
          let fecha1 = this.f1;
          let fecha2 = this.f2;
          let obj = {
            f1: fecha1,
            f2: fecha2,
            idsucursal: this.usuariosPrd.getSucursal()
          };

          let id_sucursal = this.usuariosPrd.getSucursal();

          switch (this.opcion) {
            case "ventas1":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFecha(obj).subscribe(datos => {
                  cargando.dismiss();
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;
            case "ventas2":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/mesas/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFechaMesa(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;

            case "ventas3":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/meseros/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFechaMesero(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;
            case "ventas4":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/sucursales/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFechaSucursales(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;
            case "ventas5":
              //Código a realizar
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/detalle/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFechaDetalle(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;
            case "ventas6":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ticket/barracocina/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getVentaPorFechaBarracocina(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;
              case "ventas7":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/cortecaja/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
                
              } else {
                cargando.present();
                this.reportePrd.getCortecajaReporte(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;

              case "ventas8":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/ventap/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
                
              } else {
                cargando.present();
                this.reportePrd.getProductoReporte(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Ventas")
                });
              }
              break;



            case "inventarios1":

              break;
            case "inventarios2":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/inventarios/productos/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getInventariosporProductos(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Inventarios")
                });
              }
              break;
            case "inventarios3":
              break;
            case "inventarios4":
              if (dato == 1) {
                this.iab.create(`https://docs.google.com/viewer?url=${direcciones.reportes()}/pdf/inventarios/insumos/${id_sucursal}/fechas/${this.f1}/${this.f2}`,"_system");
              } else {
                cargando.present();
                this.reportePrd.getInventariosporInsumos(obj).subscribe(datos => {
                  cargando.dismiss();
                  //this.reportePrd.crearReporte(datos);
                  this.reportePrd.enviarCorreo(datos.respuesta, "Inventarios")
                });
              }

              break;
            default:
              break;
          }

        }
      }]
    });
    mensaje.present();
  }

}

