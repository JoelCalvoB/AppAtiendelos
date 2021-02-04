import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { ConfiguracionEnlaceDetalleinventarioPage } from '../configuracion-enlace-detalleinventario/configuracion-enlace-detalleinventario';
import { ProductosProvider } from '../../providers/productos/productos';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


/**
 * Generated class for the ConfiguracionEnlaceProductoinventarioAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-configuracion-enlace-productoinventario-add',
  templateUrl: 'configuracion-enlace-productoinventario-add.html',
})
export class ConfiguracionEnlaceProductoinventarioAddPage {

  private  myForm: FormGroup;  
  private  inventario:any = [];
  private id:any = 0;
  private id_sucursal;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl:ToastController,
    private modalCtrl:ModalController,
    private productosPrd:ProductosProvider,
    private usuariosPrd:UsuariosProvider
  ) {
     let objeto = parametros.get("obj");
     this.id = objeto.id_producto;
     this.myForm = this.createMyForm(objeto);

     this.id_sucursal = this.usuariosPrd.getSucursal();
     productosPrd.obtenerinsumos(this.id,this.id_sucursal).subscribe(datos => {
            this.inventario = datos;
     });
    
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      precio:[obj.precio,Validators.required],
    });
  }

  
  saveData() {
      
    let arregloObj = [];
    for(let item of this.inventario){
      let obj2 = {
        id_inventario:item.id_inventario,
        id_producto:item.id_producto,
        cantidad:item.cantidad,
        unidad_medida:item.unidad_medida,
        marca:item.marca,
        id_sucursal:this.id_sucursal
      }
      arregloObj.push(obj2);

      
    }
    let obj = {
      id_producto:this.id,
      insumos:arregloObj
    }
    this.productosPrd.insertarinsumos(obj).subscribe(datos => {
          
    let mensaje = this.toasCtrl.create({message:"Inventario insertado al producto",duration:1500});
    mensaje.present();
    this.navCtrl.pop();

    },error =>{
      let mensaje = this.toasCtrl.create({message:"Error al insertar",duration:1500});
    mensaje.present();
    });

  }


  public agregarinventario():any{
      let modal = this.modalCtrl.create(ConfiguracionEnlaceDetalleinventarioPage,{inventario:this.inventario});
      modal.present();

      modal.onDidDismiss(respuesta => {
          
        respuesta = respuesta.datos;  
        for(let item of respuesta){
            item.id_producto = this.id;
          }
          this.inventario = respuesta; 
      });
  }

}
