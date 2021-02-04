import { Component } from '@angular/core';
import { IonicPage, NavController, FabContainer, NavParams, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { ControlMovimientoCortePage } from '../control-movimiento-corte/control-movimiento-corte';
import { ControlMovimientoFinalizadoPage } from '../control-movimiento-finalizado/control-movimiento-finalizado';
/**
 * Generated class for the ControlMovimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-control-movimiento',
  templateUrl: 'control-movimiento.html',
})
export class ControlMovimientoPage {
  private inventario;
  public arreglo: any = [];
  public arreglo2: any = [];

  public total: any = [];
  private id_sucursal;
  public existencia;
  public id_ubicacion;

  private nombre_bodega:string = "";



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private inventarioPrd: InventarioProvider, private alertaCtrl: AlertController,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController, private parametros: NavParams, private viewCtrl: ViewController, private usuariosPrd: UsuariosProvider) {

    this.id_sucursal = usuariosPrd.getSucursal();

    this.inventario = this.parametros.get("inventario");
    this.id_ubicacion = this.parametros.get("id_ubicacion");
    this.nombre_bodega = this.parametros.get("nombre_bodega");


    this.inventarioPrd.getHistorialInventario(this.inventario.id_inventario, this.id_sucursal,this.id_ubicacion).subscribe(datos => {
 
        this.arreglo = datos;

        
        this.existencia = 0;
        for(let item of this.arreglo){
          if(item.tipo_mov == 'S' || item.tipo_mov == 'V'){
            this.existencia = this.existencia - item.cantidad;
          }else{
            this.existencia = this.existencia + item.cantidad;
          }
        }
    });
  }

  ionViewDidLoad() {

  }


  public salir() {
    this.viewCtrl.dismiss();
  }


  public realizarCorte(){

      let modal = this.modalCtrl.create(ControlMovimientoCortePage,{total:this.existencia,descripcion:this.inventario.descripcion,nombre_bodega:this.nombre_bodega,
      id_inventario:this.inventario.id_inventario,id_ubicacion:this.id_ubicacion,id_sucursal:this.id_sucursal});
      modal.present();
    

      modal.onDidDismiss(datos =>{
        if(datos != undefined){
           if(datos.realizado){
                let objanalizar={
                  nombre_bodega:this.nombre_bodega,
                  sistema:this.existencia,
                  contada:datos.cantidad,
                  id_corte:datos.id_corte
                };
                this.navCtrl.pop();
                this.navCtrl.push(ControlMovimientoFinalizadoPage,{obj:objanalizar});
           }
        }
      });
  }


}
