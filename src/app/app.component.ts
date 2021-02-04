import { Component } from '@angular/core';
import { Platform, App, MenuController, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Storage } from '@ionic/storage';


import { TabsPage } from '../pages/tabs/tabs';
import { MesasPage } from '../pages/mesas/mesas';
import { ProductosPage } from '../pages/productos/productos';
import { SucursalesPage } from '../pages/sucursales/sucursales';
import { HistorialPage } from '../pages/historial/historial';
import { InventariosInicioPage } from '../pages/inventarios-inicio/inventarios-inicio';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { CajaPage } from '../pages/caja/caja';
import { ReportesMenuPage } from '../pages/reportes-menu/reportes-menu';
import { GlobalesProvider } from '../providers/globales/globales';
import { GestionUsuariosPage } from '../pages/gestion-usuarios/gestion-usuarios';
import { AyudaPage } from '../pages/ayuda/ayuda';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  inicio: any = TabsPage;
  mesas: any = MesasPage;
  productos: any = ProductosPage;
  sucursales: any = SucursalesPage;
  historial: any = HistorialPage;
  inventario: any = InventariosInicioPage;
  configuracion: any = ConfiguracionPage;
  caja: any = CajaPage;
  reportes: any = ReportesMenuPage;
  gestionusuarios: any = GestionUsuariosPage;
  ayuda:any = AyudaPage;


  public sucursal;
  public arreglo: any = [];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private usuarioPrd: UsuariosProvider, private appCtrl: App,
    private menuCtrl: MenuController, public androidPermissions: AndroidPermissions,
    private storage: Storage, private globales: GlobalesProvider, private toasCtrl: ToastController,
    private alertCtrl:AlertController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    usuarioPrd.guardarUsuario({ menu: false }, false);

    if (platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
        .then(success => {

        },
          err => {

          });

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
    }

 

    

    


  }

  ionViewDidEnter() {
  }


  public activaMenu(): boolean {
    return this.usuarioPrd.activarMenu() == true;
  }

  public onSelectChange(evento) {
    let id_sucursal = evento;
    let usuario = this.usuarioPrd.getUsuario();
    usuario.id_sucursal = id_sucursal;
    this.usuarioPrd.guardarUsuario(usuario, false);
    this.appCtrl.getRootNavs()[1].setRoot(TabsPage)
  }


  public openPage(pagina) {
    this.menuCtrl.close();
    this.rootPage = pagina;
  }

  public getUsuario(): any {

    return this.usuarioPrd.getNombreUsuario();
  }


  public activaInicio(): boolean {
    return this.usuarioPrd.activarInicio() == true;
  }
  public activaGestionUsuarios(): boolean {
    return this.usuarioPrd.activarGestionUsuarios() == true;
  }
  public activaSucursales(): boolean {
    return this.usuarioPrd.activarSucursales() == true;
  }
  public activaMesas(): boolean {
    return this.usuarioPrd.activarMesas() == true;
  }
  public activaCaja(): boolean {
    return this.usuarioPrd.activarCaja() == true;
  }
  public activaProductos(): boolean {
    return this.usuarioPrd.activarProductos() == true;
  }
  public activaHistorial(): boolean {
    return this.usuarioPrd.activarHistorialCuentas() == true;
  }
  public activaReportes(): boolean {
    return this.usuarioPrd.activarReportes() == true;
  }
  public activaAutorizador(): boolean {
    return this.usuarioPrd.activarAutorizar() == true;
  }
  public activaInventario(): boolean {
    return this.usuarioPrd.activarInventarios() == true;
  }
  public activaConfiguracion(): boolean {
    return this.usuarioPrd.activarConfiguraciones() == true;
  }


}
