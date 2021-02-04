import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { Storage } from '@ionic/storage';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ProductosProvider } from '../../providers/productos/productos';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { GenerarLlavePage } from '../generar-llave/generar-llave';
import { ConfiguracionWifiPage } from '../configuracion-wifi/configuracion-wifi';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { MapsmakerPage } from '../../pages/mapsmaker/mapsmaker';
import { ConfiguracionProvider } from '../../providers/configuracion/configuracion';
import { MesasProvider } from '../../providers/mesas/mesas';

/**
 * Generated class for the ConfiguracionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  public isFree: boolean;
  public enviarCocina: boolean;
  public enviarBarra: boolean;
  public disconected: boolean;
  public impresoraCajero: boolean;
  public impresoraCocina: boolean;
  public impresoraBarra: boolean;
  public impresoraCocinafria: boolean;
  public varias: boolean;
  public esImpresoraWifi: boolean;
  public esImpresoraBluetooth: boolean;
  public cocinabarra: boolean;
  public impresora80: boolean;
  public iva: boolean;
  public ivarecupera: boolean;
  public objWifi = {
    ipcajero: "",
    ipCocinaCaliente: "",
    ipCocinaFria: "",
    ipBarra: ""
  }
  private id;

  public semionline:boolean;

  public configuracionunica: boolean = false;


  public nombre = "";

  //iconos
  public reloadicon: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private globales: GlobalesProvider, private alertCtrl: AlertController,
    private toasCtrl: ToastController, private productosPrd: ProductosProvider,
    private categoriasPrd: CategoriasProvider, private usuariosPrd: UsuariosProvider,
    private loadCtrl: LoadingController, private configPrd: ConfiguracionProvider,private mesasPrd:MesasProvider) {
  }

  ionViewDidLoad() {
    this.isFree = this.usuariosPrd.getFree();
    let configuraciones = this.globales.getConfiguraciones();
    console.log(this.usuariosPrd.getUsuario());
    if (configuraciones != null || configuraciones != undefined) {
      this.enviarCocina = configuraciones.enviarCocina;
      this.enviarBarra = configuraciones.enviarBarra;
      this.disconected = configuraciones.disconected;
      this.varias = configuraciones.varias;
      this.impresoraCajero = configuraciones.impresoraCajero;
      this.impresoraCocina = configuraciones.impresoraCocina;
      this.impresoraBarra = configuraciones.impresoraBarra;
      this.esImpresoraWifi = configuraciones.esImpresoraWifi;
      this.esImpresoraBluetooth = configuraciones.esImpresoraBluetooth;
      this.cocinabarra = configuraciones.cocinabarra;
      this.objWifi.ipBarra = configuraciones.ipBarra;
      this.objWifi.ipcajero = configuraciones.ipcajero;
      this.objWifi.ipCocinaCaliente = configuraciones.ipCocinaCaliente;
      this.objWifi.ipCocinaFria = configuraciones.ipCocinaFria;
      this.nombre = this.usuariosPrd.getUsuario().empresa_nombre;
      this.impresoraCocinafria = configuraciones.impresoraCocinaFria;
      this.impresora80 = configuraciones.impresora80;
      this.iva = configuraciones.iva;
      this.ivarecupera = configuraciones.ivarecupera;
      this.semionline = configuraciones.semionline;
      this.id = configuraciones.id;
    }
  }




  public abrirpaginabluetooth() {
    this.navCtrl.push(BluetoothPage);
  }

  public generarcancelados() {
    this.navCtrl.push(GenerarLlavePage);
  }

  public guardarCambios() {


      



    let alerta = this.alertCtrl.create({
      subTitle: "¿Deseas guardar cambios?",
      message: "Guardando configuraciones de la aplicación",
      buttons: [{
        text: "Si", handler: () => {
          let cargando = this.loadCtrl.create({ content: "Guardando configuraciones" });
          cargando.present();
          let obj = {
            enviarCocina: this.enviarCocina,
            enviarBarra: this.enviarBarra,
            disconected: this.disconected,
            varias: this.varias,
            impresoraCajero: this.impresoraCajero,
            impresoraCocina: this.impresoraCocina,
            impresoraBarra: this.impresoraBarra,
            impresoraCocinaFria: this.impresoraCocinafria,
            esImpresoraWifi: this.esImpresoraWifi,
            esImpresoraBluetooth: this.esImpresoraBluetooth,
            cocinabarra: this.cocinabarra,
            ipCocinaCaliente: this.objWifi.ipCocinaCaliente,
            ipcajero: this.objWifi.ipcajero,
            ipCocinaFria: this.objWifi.ipCocinaFria,
            ipBarra: this.objWifi.ipBarra,
            nombre: this.nombre,
            impresora80: this.impresora80,
            iva: this.iva,
            ivarecupera: this.ivarecupera,
            id_sucursal:this.usuariosPrd.getSucursal(),
            semionline:this.semionline,
            id:this.id
          }



          if(!this.configuracionunica && !this.isFree){
            this.configPrd.setConfiguracion(obj).subscribe(datos => {
              this.storage.set("configuraciones", datos);
              this.globales.setConfiguraciones(datos);

              console.log("Entra a las configuraciones");
              console.log(datos);
              this.id = datos.id;
              console.log("el id sin repetir es este");
              console.log(datos.id);

              if(this.globales.isSemiOnline()){
                  this.mesasPrd.gets(this.usuariosPrd.getSucursal()).subscribe(datos =>{
                    let objuser = this.usuariosPrd.getUsuario();
                    objuser.mesasestablecimiento = datos;
                    this.storage.set("usersemi",objuser);
                    this.usuariosPrd.guardarUsuario(objuser,false);
                  },err=>{
                    let toat = this.toasCtrl.create({message:"Es necesario estar conectado a internet para bajar las mesas si es que contiene mesas la sucuresal",showCloseButton:true,closeButtonText:"Entendido"});
                    toat.present();
                  });
              }

              let toast = this.toasCtrl.create({ message: "Configuraciones de la aplicación guardadas con exito", duration: 1500 });
              toast.present();
              cargando.dismiss();
            }, err => {
              let toast = this.toasCtrl.create({ message: "Error al guardar verifique conexión a internet", showCloseButton: true, closeButtonText: "Entendido" });
              toast.present();
              cargando.dismiss();
            });

          }else{
            this.storage.set("configuraciones", obj);
            this.globales.setConfiguraciones(obj);
            cargando.dismiss();
          }
        }
      }, "No"]
    });
    alerta.present();
  }


  public salir() {
    this.globales.cerrarAplicacion();
  }

  public recargar() {
    this.reloadicon = true;
    this.productosPrd.getCategoriaConListaproductos().subscribe(listadoproductos => {
      this.categoriasPrd.gets().subscribe(categorias => {
        let objetoGuardar = {
          categorias: categorias,
          listaproductos: listadoproductos
        };

        this.storage.set("listaproductosdetallemesa", objetoGuardar);
        this.reloadicon = false;
        let toast = this.toasCtrl.create({ message: "Catálogos cargados correctamente", duration: 1500 });
        toast.present();

      });
    });
  }

  public abrirpaginaWifi() {
    this.navCtrl.push(ConfiguracionWifiPage, { objWifi: this.objWifi });
  }

  public PruebQr() {
    this.navCtrl.push(MapsmakerPage);

  }
}
