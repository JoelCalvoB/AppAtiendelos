import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, App, AlertController, ModalController, TextInput } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { Storage } from '@ionic/storage';
import { MesasPage } from '../mesas/mesas';
import { ProductosPage } from '../productos/productos';
import { SucursalesPage } from '../sucursales/sucursales';
import { HistorialPage } from '../historial/historial';
import { InventariosPage } from '../inventarios/inventarios';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { CajaPage } from '../caja/caja';
import { ReportesMenuPage } from '../reportes-menu/reportes-menu';
import { GestionUsuariosPage } from '../gestion-usuarios/gestion-usuarios';
import { InicioAtiendelosrestaurantPage } from '../inicio-atiendelosrestaurant/inicio-atiendelosrestaurant';
import { EmpresasPage } from '../empresas/empresas';
import { EmpresasProvider } from '../../providers/empresas/empresas';
import { empresaLugar } from '../../assets/direcciones';
import { UsuariosActivosPage } from '../usuarios-activos/usuarios-activos';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GlobalesProvider } from '../../providers/globales/globales';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild("usuario") usuarioElement: TextInput;
  public invalido: boolean = false;
  public arreglo = [];
  public sucursal: any = "";
  public valida = [];

  inicio: any = TabsPage;
  mesas: any = MesasPage;
  productos: any = ProductosPage;
  sucursales: any = SucursalesPage;
  historial: any = HistorialPage;
  inventario: any = InventariosPage;
  configuracion: any = ConfiguracionPage;
  caja: any = CajaPage;
  reportes: any = ReportesMenuPage;
  gestionusuarios: any = GestionUsuariosPage;
  public dateAnterior;
  public contador;
  public indiceAnterior;
  public indice;
  public empresa: any;
  public version: string = "1.1.2";
  public dat;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private toasCtrl: ToastController, private usuariosPdr: UsuariosProvider, private loadCtrl: LoadingController,
    private sucursalesPrd: SucursalesProvider, private appCtrl: App, private alertCtrl: AlertController, private empresasPrd: EmpresasProvider,
    private modalCtrl: ModalController, private iab: InAppBrowser, private globales: GlobalesProvider) {
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {



    this.storage.get("configuraciones").then(valor => {
      this.globales.setConfiguraciones(valor);


      this.storage.get("free").then(freeDts => {
        let isFree: boolean = freeDts == undefined ? false : freeDts;
        if (!isFree && !this.globales.isSemiOnline()) {

          this.empresasPrd.version().subscribe(datos => {

            if (this.version != datos.version) {
              let mensaje = this.alertCtrl.create({
                title: "Versión nueva disponible", message: "¿Deseas redirigirte a la página oficial para descargar la nueva actualización de \"ATIENDELOS\"?", buttons: [
                  {
                    text: "Actualizar", handler: () => {
                      this.iab.create(`https://atiendelosrestaurant.000webhostapp.com/`, "_system");
                    }
                  }, "Cancelar"
                ]
              });

              mensaje.present();
            }
          });


          this.storage.get("inicio").then(inicio => {
            if (inicio != undefined) {
              this.empresasPrd.getEmpresa().then(empresa => {
                if (empresa != undefined) {
                  this.empresa = empresa;
                  empresaLugar.empre = this.empresa.usuario;
                  this.storage.get('logeado').then((val) => {
                    if (val == true) {
                      this.storage.get('obj').then((objeto) => {
                        objeto.empresa_nombre = this.empresa.nombre;
                        objeto.empresa_usuario = this.empresa.usuario;
                        this.usuariosPdr.guardarUsuario(objeto, true);
                        let iniciar = this.usuariosPdr.iniciar_en();
                        this.elegirIniciar(iniciar);
                      });
                    } else {

                      let cargando = this.loadCtrl.create({ content: "Espere, cargando sucursales" });
                      cargando.present();
                      this.sucursalesPrd.gets().subscribe(datos => {
                        this.arreglo = datos;
                        cargando.dismiss();
                      }, error => {
                        cargando.dismiss();
                        let mensajeError = this.toasCtrl.create({ message: "Error al cargar las sucursales,\nNota: Cerrar la aplicación", closeButtonText: "Cerrar", showCloseButton: true });
                        mensajeError.present();
                      });
                    }
                  });
                } else {
                  this.navCtrl.push(InicioAtiendelosrestaurantPage);
                }
              }).catch(error => {
                this.navCtrl.push(InicioAtiendelosrestaurantPage);
              });
            } else {
              this.navCtrl.push(InicioAtiendelosrestaurantPage);
            }
          });


        } else {

          if (isFree) {

            this.storage.get("userfree").then(dat => {
              this.usuariosPdr.guardarUsuario(dat, false);
              this.usuariosPdr.isFree(true);
              this.empresa = {
                id_sucursal: 0,
                nombre: "AtiendelosRestaurant FREE"
              };
            });
          } else if (this.globales.isSemiOnline()) {
            this.storage.get("empresa").then(dato => {
              this.empresa = dato;
              empresaLugar.empre = this.empresa.usuario;
              this.storage.get("usersemi").then(dat => {
                this.storage.get('obj').then((objeto) => {
                   if(objeto != undefined && objeto != null){
                    objeto.mesasestablecimiento = dat.mesasestablecimiento;
                    objeto.tickets = dat.tickets;
                    this.usuariosPdr.guardarUsuario(objeto, false);
                    
                   }
                   this.dat = dat;
                });
              });

            });

          }
        }
      });

    });


  }

  public ingresar(usuario, contra): any {
    let strUsuario = usuario.value;
    let strContra = contra.value;
    let toas = this.toasCtrl.create({ message: "Usuario y/o Contraseña invalidos", duration: 2000 });

    if (strUsuario.trim() == "") {
      this.invalido = true;
      toas.present();
      return;
    }

    if (strContra.trim() == "") {
      this.invalido = true;
      toas.present();
      return;
    }

    let obj = {
      login: strUsuario,
      password: strContra,
      idSucursal: this.empresa.id_sucursal
    }


    if (!this.usuariosPdr.getFree()) {
      this.usuariosPdr.ingresarSistema(obj).subscribe(datos => {
        let ingresar = datos.entrar;
        if (ingresar == true) {
            let toas = this.toasCtrl.create({ message: "Sistema ingresado con exito", duration: 1500 });
            toas.present();
           



            if(this.globales.isSemiOnline()){
              
                datos.mesasestablecimiento = this.dat.mesasestablecimiento;
                datos.tickets = this.dat.tickets;
                datos.nombreEmpresa = this.empresa.nombre;
            }

            datos.empresa_nombre = this.empresa.nombre;
            datos.empresa_usuario = this.empresa.usuario;


            this.usuariosPdr.guardarUsuario(datos, true);
            this.storage.set('obj', datos);
            this.storage.set('logeado', true);
            this.navCtrl.setRoot(TabsPage);
            let iniciar = this.usuariosPdr.iniciar_en();
            this.elegirIniciar(iniciar);
          
        } else {
          let toas = this.toasCtrl.create({ message: "Usuario / Contraseña invalidos", duration: 1500 });
          toas.present();
        }
      });
    } else {
      if (strContra.trim() == "1111") {
        let toas = this.toasCtrl.create({ message: "Sistema ingresado con exito", duration: 1500 });
        toas.present();
        this.navCtrl.setRoot(TabsPage);
        let iniciar = this.usuariosPdr.iniciar_en();
        this.elegirIniciar(iniciar);
      } else {
        toas.present();
      }
    }


  }

  public elegirIniciar(iniciando) {
    switch (iniciando) {
      case 1:
        this.navCtrl.setRoot(this.inicio);
        break;
      case 2:
        this.navCtrl.setRoot(this.gestionusuarios);
        break;
      case 3:
        this.navCtrl.setRoot(this.sucursales);
        break;
      case 4:
        this.navCtrl.setRoot(this.mesas);
        break;
      case 5:
        this.navCtrl.setRoot(this.caja);
        break;
      case 6:
        this.navCtrl.setRoot(this.productos);
        break;
      case 7:
        this.navCtrl.setRoot(this.historial);
        break;
      case 8:
        this.navCtrl.setRoot(this.reportes);
        break;
      case 9:

        break;
      case 10:
        this.navCtrl.setRoot(this.inventario);
        break;
      case 11:
        this.navCtrl.setRoot(this.configuracion);
        break;
      default:
        this.navCtrl.setRoot(TabsPage);
        break;
    }

  }


  public verEmpresas(indice) {

    this.indice = indice;

    if (this.indice == this.indiceAnterior) {
      var tiempoActual: any = new Date();
      let tiempoTranscurrido = tiempoActual - this.dateAnterior;
      if (tiempoTranscurrido > 250) {
        this.contador = 0;
        this.dateAnterior = new Date();
      }
      this.contador = this.contador + 1;
      if (this.contador == 2) {
        this.ejecutar();
        this.dateAnterior = new Date();
      } else if (this.contador > 2) {
        this.contador = 1;
      }
    } else {
      this.dateAnterior = new Date();
      this.indiceAnterior = this.indice;
      this.contador = 1;
    }
  }

  public ejecutar() {
    let alerta = this.alertCtrl.create({
      subTitle: "Super administrador", inputs: [{ type: "text", placeholder: "Super usuario", name: "usuario" },
      { type: "text", placeholder: "Contraseña", name: "password" }],
      buttons: ["Cancelar", {
        text: "Aceptar", handler: (datos) => {

          let obj = {
            usuario: datos.usuario,
            password: datos.password
          };

          this.empresasPrd.login(obj).subscribe(respuesta => {
            if (respuesta.entra == true) {
              this.navCtrl.push(EmpresasPage, { empresa: this.empresa });
            }
          });

        }
      }]
    });

    alerta.present();
  }

  public seleccionarUsuario() {
    let modal = this.modalCtrl.create(UsuariosActivosPage, { login: true, id_sucursal: this.empresa.id_sucursal }, {
      cssClass: "margen_modal"
    });
    modal.present();
    modal.onDidDismiss((datos) => {
      if (datos != undefined) {

        this.usuarioElement.value = datos;
      }
    });
  }


}
