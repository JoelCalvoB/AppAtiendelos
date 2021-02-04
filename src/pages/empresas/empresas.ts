import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { GlobalesProvider } from '../../providers/globales/globales';
import { EmpresasProvider } from '../../providers/empresas/empresas';
import { EmpresasAddPage } from '../empresas-add/empresas-add';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-empresas',
  templateUrl: 'empresas.html',
})
export class EmpresasPage {


  public arreglo: any = [];
  public indiceAnterior;
  public indice;
  public contador;
  public dateAnterior;
  public empresa ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private empresasPrd: EmpresasProvider, private alertaCtrl: AlertController, private toasCtrl: ToastController,
  private actionshetCtrl:ActionSheetController,private alertctrl:AlertController,private storage:Storage) {
    this.trerSucursales();
  }

  ionViewDidLoad() {
      this.empresa = this.navParams.get("empresa");
 
  }

  public trerSucursales(): any {
    this.empresasPrd.gets().subscribe(datos => { this.arreglo = datos; });
  }

  ionViewDidEnter() {
    this.trerSucursales();

  }
  public actualizando(refresher): any {
    this.empresasPrd.gets().subscribe(res => {
      this.arreglo = res;
      refresher.complete();
    });
  }

  public agregar() {
    this.navCtrl.push(EmpresasAddPage, { boton: "Agregar" });
  }

  public actualizar(obj: any) {
    this.navCtrl.push(EmpresasAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.id;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.empresasPrd.eliminar(id).subscribe(resp => {
            this.empresasPrd.gets().subscribe(res => {
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

  public marcar(item, index) {
    for (let i of this.arreglo) {
      i.colorear = false;
    }
    index.colorear = true;

    this.indice = item;

    if (this.indice == this.indiceAnterior) {
      var tiempoActual: any = new Date();
      let tiempoTranscurrido = tiempoActual - this.dateAnterior;
      if (tiempoTranscurrido > 250) {
        this.contador = 0;
        this.dateAnterior = new Date();
      }
      this.contador = this.contador + 1;
      if (this.contador == 2) {
        this.ejecutaAccion(index);
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

  public ejecutaAccion(item){
    const actionSheet = this.actionshetCtrl.create({
      title: 'Seleccionar acción',
      cssClass: 'action-sheets-groups-page',
      buttons: [
        {
          text: 'Seleccionar',
          icon: "checkmark",
          handler: () => {
            this.storage.set("empresa",item);
            this.navCtrl.pop();
          }
        },
        {
          text: 'Modificar',
          icon: "brush",
          handler: () => {
            
            this.navCtrl.push(EmpresasAddPage, { parametro: item, boton: "Actualizar" });
          }
        },
        {
          text: 'Eliminar',
          icon: "trash",
          handler: () => {
            this.eliminar(item);
          }
        }, {
          text: 'Cancelar',
          icon: "close",
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();

  }


}
