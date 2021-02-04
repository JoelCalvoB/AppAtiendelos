import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Platform, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

/*
  Generated class for the ReportesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportesProvider {

  public ruta: string = "";
  public ruta1: string = "";
  constructor(public http: HttpClient, private ft: FileTransfer, private platform: Platform, private file: File,
    private document: DocumentViewer, private toastCtrl: ToastController, private alerta: AlertController, private google: GooglePlus,
    private loadCtrl: LoadingController) {
    
  }

  public getHistoricoCuentas(id_sucursal): Observable<any> {
    this.ruta = direcciones.reportes();
    let dire = this.ruta + "/ticket/" + id_sucursal;
    
    return this.http.get(dire);
  }

  public getVentaPorFecha(obj):Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/ticket/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public getVentaPorFechaMesa(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/ticket/mesas/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }
  public getVentaPorFechaMesero(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/ticket/meseros/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public getVentaPorFechaSucursales(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;

    let dire = this.ruta + "/ticket/sucursales/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public getVentaPorFechaBarracocina(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/ticket/barracocina/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public getCortecajaReporte(obj):Observable<any>{
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + `/cortecaja/${id_sucursal}/fechas/${f1}/${f2}`;
    return this.http.get(dire);
  }

  public getProductoReporte(obj):Observable<any>{
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + `/ventaproducto/${id_sucursal}/fechas/${f1}/${f2}`;
    return this.http.get(dire);
  }



  public getVentaPorFechaDetalle(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/ticket/detalle/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public getInventariosporProductos(obj):Observable<any>  {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/inventarios/productos/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }


  public getInventariosporInsumos(obj) :Observable<any> {
    this.ruta = direcciones.reportes();

    let f1 = obj.f1;
    let f2 = obj.f2;
    let id_sucursal = obj.idsucursal;

    let dire = this.ruta + "/inventarios/insumos/" + id_sucursal + "/fechas?fecha1=" + f1 + "&fecha2=" + f2;
    return this.http.get(dire);
  }

  public crearReporte(datos): any {
    this.ruta = direcciones.reportes();

    const fileTransfer: FileTransferObject = this.ft.create();
    const options: DocumentViewerOptions = {
      title: 'Reporte'
    }

    if (this.platform.is('cordova')) {
      let filename = "reporte.pdf";
      let writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    
      this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(datos.respuesta, 'data:application/pdf;base64'), { replace: true })
        .then(() => {

          this.document.viewDocument(writeDirectory + filename, 'application/pdf', options);

        })
        .catch(() => {
          console.error('Error writing pdf file');
        });
    } else {
      
      let pdfWindow = window.open("")
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64," + datos.respuesta + "'></iframe>")
    }
  }
  public convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  public EstadisticaMasVendido(obj) {
    this.ruta1 = direcciones.estadisticas();
    let f1 = obj.FechaI;
    let f2 = obj.FechaF;
    let id_sucursal = obj.id_sucursal;

    let dire = this.ruta1 + "/productomasvendido/" + f1 + "/" + f2 + "/" + id_sucursal;
    
    return this.http.get(dire);
  }

  public EstadisticaVentaPorMesero(obj) {
    this.ruta1 = direcciones.estadisticas();
    let f1 = obj.FechaI;
    let f2 = obj.FechaF;
    let id_sucursal = obj.id_sucursal;

    let dire = this.ruta1 + "/vendido/" + f1 + "/" + f2 + "/" + id_sucursal;
    
    return this.http.get(dire);
  }

  public EstadisticaVentaPorMes() {
    this.ruta1 = direcciones.estadisticas();


    let dire = this.ruta1 + "/vendidopormes/";
    
    return this.http.get(dire);
  }


  public enviarCorreo(pdfCodificado, mensajeEnviar) {
    
    this.google.login({
      scopes: 'https://www.googleapis.com/auth/gmail.send https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify'
    })
      .then(res => {

        let alert = this.alerta.create({
          title: "Correo Electrónico", message: "Ingresa el correo electrónico",
          inputs: [{ type: "text", placeholder: "Correo Eletrónico", name: "correo" }],
          buttons: [{
            text: "Aceptar", handler: parametro => {
              let id_token = res.accessToken;
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'message/rfc822',
                  'Authorization': 'Bearer ' + id_token
                })
              };


              let usuarioEnviar = res.email;
              let userId = res.userId;
              let direccion = "https://www.googleapis.com/upload/gmail/v1/users/" + userId + "/messages/send?uploadType=multipart";

              let ms1 = "From: AppMovil REPORTES<" + usuarioEnviar + ">\n";
              ms1 = ms1 + "to: " + parametro.correo + "\n";
              ms1 = ms1 + `Subject: ${mensajeEnviar}\n`;
              ms1 = ms1 + "MIME-Version: 1.0\n";
              ms1 = ms1 + "Content-Type: multipart/mixed;\n";
              ms1 = ms1 + "        boundary=\"limite1\"\n\n";
              ms1 = ms1 + "En esta sección se prepara el mensaje\n\n";
              ms1 = ms1 + "--limite1\n";
              ms1 = ms1 + "Content-Type: text/plain\n\n";
              ms1 = ms1 + "Reporte enviado desde la app movil\n\n";
              ms1 = ms1 + "--limite1\n";
              ms1 = ms1 + "Content-Type: application/pdf;\n\tname=reporte.pdf;\n";
              ms1 = ms1 + "Content-Transfer-Encoding: BASE64;\n\n"
              ms1 = ms1 + pdfCodificado;

              let cargando = this.loadCtrl.create({ content: "Enviando correo electrónico" });
              cargando.present();

              this.http.post(direccion, ms1, httpOptions).subscribe(datos => {
                cargando.dismiss();
                let toas = this.toastCtrl.create({ message: "Mensaje envíado correctamente", duration: 1500 });
                toas.present();
              }, error => {
                cargando.dismiss();
                let toas = this.alerta.create({ message: JSON.stringify(error) });
                toas.present();
              });
            }
          }]
        });
        alert.present();


      })
      .catch(err => {
        let toast = this.toastCtrl.create({ message: "Mensaje no enviado, error en el correo", duration: 1500 });
        toast.present();
      });
  }

}
