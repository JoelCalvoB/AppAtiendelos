import { Component } from '@angular/core';
import { App, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { BluetoothDispositivosPage } from '../bluetooth-dispositivos/bluetooth-dispositivos';
import { Storage } from '@ionic/storage';
import { GlobalesProvider } from '../../providers/globales/globales';
import { LoginPage } from '../login/login';
import { InventariosPage } from '../inventarios/inventarios';
import { EmpresasProvider } from '../../providers/empresas/empresas';
import { empresaLugar } from '../../assets/direcciones';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { ConfiguracionProvider } from '../../providers/configuracion/configuracion';
import { MesasProvider } from '../../providers/mesas/mesas';

/**
 * Generated class for the InicioAtiendelosrestaurantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inicio-atiendelosrestaurant',
  templateUrl: 'inicio-atiendelosrestaurant.html',
})
export class InicioAtiendelosrestaurantPage {
  public wifi: boolean = false;
  public blue: boolean = false;
  public cajero: boolean = false;
  public cocina: boolean = false;
  public barra: boolean = false;
  public cocinaFria: boolean = false;


  public cajeroConectado: boolean = false;
  public cocinaConectado: boolean = false;
  public barraConectado: boolean = false;
  public disconected: boolean = false;
  public cocinabarra: boolean = false;

  public ipCajero: string = "";
  public ipCocinaFria: string = "";
  public ipCocinaCaliente: string = "";
  public ipBarra: string = "";


  public usuario;
  public password;
  public habilitar: boolean = false;
  public antes: boolean = true;
  public reloadicon: boolean = false;
  public verificado: boolean = false;
  public free: boolean = false;
  public paga: boolean = false;

  public sucursales: any = [];
  public sucursalSeleccionada = 0;

  public habilitarFree: boolean = false;

  public configuracion = {
    enviarCocina: false,
    enviarBarra: false,
    impresoraCajero: false,
    impresoraBarra: false,
    impresoraCocina: false,
    disconected: false,
    varias: false,
    esImpresoraBluetooth: false,
    esImpresoraWifi: false,
    cocinabarra: false,
    ipCocinaCaliente: "",
    ipcajero: "",
    ipCocinaFria: "",
    ipBarra: "",
    nombre: ""

  };
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private storage: Storage, private globales: GlobalesProvider, private appCtrl: App, private alertCtrl: AlertController,
    private empresaPrd: EmpresasProvider, private toasCtrl: ToastController, private sucursalesPrd: SucursalesProvider,
    private configPrd: ConfiguracionProvider,private mesasPrd:MesasProvider) {
  }

  ionViewDidLoad() {
    
  }

  public clickwifi() {
    this.blue = false;
    this.wifi = true;
  }

  public clickblue() {
    this.wifi = false;
    this.blue = true;
  }




  public clickCajero() {
    this.cocina = false;
    this.barra = false;
    this.cajero = true;

    let modal = this.modalCtrl.create(BluetoothDispositivosPage, { tipo: "cajero", aparecer: true });
    modal.present();

    modal.onDidDismiss(dato => {
      if (dato != undefined) {
        if (dato == true) {
          this.cajeroConectado = true;
          this.configuracion.impresoraCajero = true;
        }
      }
    });
  }

  public clickcocina() {
    this.cocina = true;
    this.barra = false;
    this.cajero = false;


    let modal = this.modalCtrl.create(BluetoothDispositivosPage, { tipo: "cocina", aparecer: true });
    modal.present();

    modal.onDidDismiss(dato => {
      if (dato != undefined) {
        if (dato == true) {
          this.cocinaConectado = true;
          this.configuracion.enviarCocina = true;
          this.configuracion.impresoraCocina = true;
        }
      }
    });
  }

  public clickbarra() {
    this.cocina = false;
    this.barra = true;
    this.cajero = false;

    let modal = this.modalCtrl.create(BluetoothDispositivosPage, { tipo: "barra", aparecer: true });
    modal.present();

    modal.onDidDismiss(dato => {
      if (dato != undefined) {
        if (dato == true) {
          this.barraConectado = true;
          this.configuracion.enviarBarra = true;
          this.configuracion.impresoraBarra = true;
        }
      }
    });
  }


  public continuar() {


    console.log("Se va a continuarl");

    this.configuracion.esImpresoraBluetooth = this.blue;
    this.configuracion.esImpresoraWifi = this.wifi;
    this.configuracion.cocinabarra = this.cocinabarra;
    this.configuracion.disconected = this.disconected;

    this.configuracion.ipcajero = this.ipCajero;
    this.configuracion.ipCocinaCaliente = this.ipCocinaCaliente;
    this.configuracion.ipCocinaFria = this.ipCocinaFria;
    this.configuracion.ipBarra = this.ipBarra;

   

    console.log(this.configuracion);
    console.log("Despues de la configuracion");



    this.storage.set("inicio", true);
    this.storage.set("configuraciones", this.configuracion);
    this.globales.setConfiguraciones(this.configuracion);

    console.log("Se escablece las configuraciones ahora va getEmpresa");

    this.empresaPrd.getEmpresa().then(dato => {

      console.log("adentro de getempresa");
      console.log(dato);
      let empresa: any = dato;
      empresa.id_sucursal = this.sucursales[this.sucursalSeleccionada].id;
      this.empresaPrd.setEmpresa(empresa);

      console.log("Se va a getconfiguracion");

      this.configPrd.getConfiguracion(empresa.id_sucursal).subscribe(datos => {
        console.log("Estamos en getconfiguracion");
        console.log(datos);
        if (datos != undefined || datos != null) {
          this.storage.set("configuraciones", datos);
          this.globales.setConfiguraciones(datos);


          if(datos.semionline){
             let alert = this.alertCtrl.create({title:"AVISO",message:"LA APLICACIÓN ESTA EN MODO VENTA OFFLINE, PARA PODER INGRESAR AL SISTEMA PREVIAMENTE DEBE ESTAR CONECTADO A INTERNET, UNA VEZ DESCONECTADO PUEDE HACER VENTAS SIN PROBLEMA SIN OLVIDAR QUE DEBE SINCRONIZAR AL FINAL DEL DIA",buttons:["Entendido"]});
             alert.present();

             
             this.mesasPrd.gets( this.sucursales[this.sucursalSeleccionada].id).subscribe(dd =>{
              
                let obj = {
                  mesasestablecimiento:dd
                };

                this.storage.set("usersemi",obj);
                this.appCtrl.getRootNavs()[1].setRoot(LoginPage);
                this.storage.set("logeado", false);
             });
          }else{
            this.appCtrl.getRootNavs()[1].setRoot(LoginPage);
            this.storage.set("logeado", false);
          }
        }else{
            let toast = this.toasCtrl.create({message:"Todavía no hay configuraciones establecidas en esta empresa, Favor de ingresarlas",closeButtonText:"Entendido",showCloseButton:true});
            toast.present();
            this.appCtrl.getRootNavs()[1].setRoot(LoginPage);
        }
      });
    });
  }


  public continuarFree() {
    this.storage.set("inicio", true);
    this.storage.set("free", true);


    let datosUsuarioFree = {
      autorizar: true,
      bar: false,
      caja: true,
      capitan: true,
      catalogos: false,
      cocina: false,
      configuraciones: true,
      cuentas: true,
      entrar: true,
      gestion_usuarios: true,
      historial_cuentas: true,
      iniciar_en: 1,
      inicio: true,
      inventario: true,
      login: "Admin",
      menu: true,
      mesas: true,
      nombre: "Admin",
      password: "1111",
      productos: true,
      reportes: true,
      sucursales: true,
      transacciones: true,
      sucursal: "Sucursal 1",
      mesasestablecimiento: [],
      tickets: []
    }

    this.storage.set("userfree", datosUsuarioFree);
    this.configuracion.nombre = "Sucursal 1";
    this.globales.setConfiguraciones(this.configuracion);
    this.appCtrl.getRootNavs()[1].setRoot(LoginPage);
  }


  public inventarios() {

    this.navCtrl.push(InventariosPage)
  }

  public clickCajeroWifi() {
    this.cocina = false;
    this.barra = false;
    this.cajero = true;
    this.cocinaFria = false;

    let alerta = this.alertCtrl.create({
      subTitle: "Impresora cajero", message: "Dirección ip",
      inputs: [{ type: "text", name: "cajero" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          this.ipCajero = datos.cajero;
        }
      }]
    });

    alerta.present();
  }

  public clickcocinaWifiFria() {
    this.cocina = false;
    this.barra = false;
    this.cajero = false;
    this.cocinaFria = true;


    let alerta = this.alertCtrl.create({
      subTitle: "Impresora cocina fria", message: "Dirección ip",
      inputs: [{ type: "text", name: "cajero" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          this.ipCocinaFria = datos.cajero;
        }
      }]
    });

    alerta.present();
  }

  public clickcocinaWifiCaliente() {
    this.cocina = true;
    this.barra = false;
    this.cajero = false;
    this.cocinaFria = false;

    let alerta = this.alertCtrl.create({
      subTitle: "Impresora cocina caliente", message: "Dirección ip",
      inputs: [{ type: "text", name: "cajero" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          this.ipCocinaCaliente = datos.cajero;
        }
      }]
    });

    alerta.present();
  }


  public clickbarraWifi() {
    this.cocina = false;
    this.barra = true;
    this.cajero = false;
    this.cocinaFria = false;


    let alerta = this.alertCtrl.create({
      subTitle: "Impresora barra", message: "Dirección ip",
      inputs: [{ type: "text", name: "cajero" }], buttons: [{
        text: "Aceptar", handler: (datos) => {
          this.ipBarra = datos.cajero;
        }
      }]
    });

    alerta.present();
  }

  public horaDia() {
    let date = new Date();
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm: any = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  public validar() {
    let obj = {
      usuario: this.usuario,
      password: this.password
    }

    this.antes = false;
    this.reloadicon = true;
    this.empresaPrd.loginempresa(obj).subscribe(datos => {
      this.empresaPrd.setEmpresa(datos);
      empresaLugar.empre = datos.usuario;


      this.habilitar = datos.entra;


      this.reloadicon = false;
      this.verificado = true;

      this.sucursalesPrd.gets().subscribe(datos => {
        this.sucursales = datos;
        this.sucursales[this.sucursalSeleccionada].colorear = true;
      });

    }, err => {
      this.antes = true;
      this.reloadicon = false;
      let toast = this.toasCtrl.create({ message: "Error de clave, insertar el seria correcto", duration: 1500 });
      toast.present();
    });

  }


  public ClickFree() {
    this.free = true;
    this.paga = false;
  }

  public clickPaga() {
    this.free = false;
    this.paga = true;

  }


  public marcarSucursal(indice) {
    for (let item of this.sucursales) {
      item.colorear = false;
    }

    this.sucursales[indice].colorear = true;
    this.sucursalSeleccionada = indice;
  }

}
