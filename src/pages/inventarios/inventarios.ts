import { Component } from '@angular/core';
import { IonicPage, NavController, FabContainer, NavParams, AlertController, ToastController, ModalController, Select, ActionSheetController } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { InventariosAddPage } from '../inventarios-add/inventarios-add';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AjusteInventarioPage } from '../ajuste-inventario/ajuste-inventario';
import { ControlMovimientoPage } from '../control-movimiento/control-movimiento';
import { ConfiguracionCategoriasPage } from '../configuracion-categorias/configuracion-categorias';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


@Component({
  selector: 'page-inventarios',
  templateUrl: 'inventarios.html',
})
export class InventariosPage {
  private arreglo: any = [];
  private arreglo1: any = [];

  public letras: string = "";
  public verdadero: any = [];
  private id_bodega;
  public nombre_bodega;
  public id_sucursal;
  public arreglobodegas=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private inventarioPrd: InventarioProvider, private alertaCtrl: AlertController,
    private toasCtrl: ToastController, private notificaciones: LocalNotifications,
    private modalCtrl: ModalController, private parametros: NavParams, private actionshetCtrl: ActionSheetController, private usuariosPrd: UsuariosProvider) {

    this.id_sucursal = this.usuariosPrd.getSucursal();

  }

  ionViewDidEnter() {

    this.inventarioPrd.gets().subscribe(datos => {
      this.arreglo = datos;
      this.verdadero = datos;
    });


    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(datos => {
      this.arreglobodegas = datos;
    });
  }
  public desglose(obj: any) {
    

    let arregloopciones =[     {
      text: 'Sucursal actual',
      icon: "checkmark-circle",
      handler: () => {
        this.navCtrl.push(ControlMovimientoPage, { inventario: obj, id_ubicacion: 0,nombre_bodega:"Sucursal actual" });
      }
    }];

    for(let item of this.arreglobodegas){
        let objitem = {text: item.nombre_bodega,
        icon: "home",
        handler: () => {
          this.navCtrl.push(ControlMovimientoPage, { inventario: obj, id_ubicacion: item.id_bodega,nombre_bodega:item.nombre_bodega});
        }};

        arregloopciones.push(objitem);
    }


    let objfinal = {
      text: 'Cancelar consulta',
      icon: "close", 
      cssClass: 'colorBoton',
      handler:()=>{}
    }

    arregloopciones.push(objfinal);


    

    //-.--------------termina las opciones aqui
   

    const actionSheet = this.actionshetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'accionshet',
      buttons: 
        arregloopciones
      
    });
    actionSheet.present();

    // let modal = this.modalCtrl.create(ControlMovimientoPage, { valorEnviado: obj });
    // modal.present();

  }

  public agregar() {
    this.navCtrl.push(InventariosAddPage, { boton: "Agregar" })
  }

  public ajustes(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(AjusteInventarioPage, { boton: "Agregar" })
  }

  public enlace(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ConfiguracionCategoriasPage, { boton: "Cart" })
  }


  public actualizando(refresher): any {

    this.inventarioPrd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  public actualizar(obj: any) {
    this.navCtrl.push(InventariosAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.id_inventario;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.inventarioPrd.eliminar(id).subscribe(resp => {
            this.inventarioPrd.gets().subscribe(res => {
              this.arreglo = res;
            });
            let toas = this.toasCtrl.create({ message: "Registro Eliminado", duration: 1500 });
            toas.present();
          });

        }
      }, "Cancelar"]
    });


    alerta.present();

  }

  getItems(obj) {
    this.arreglo = this.verdadero.filter(obj => obj.descripcion.includes(this.letras));
  }





}
