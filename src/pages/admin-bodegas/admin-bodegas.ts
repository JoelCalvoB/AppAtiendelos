import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController,FabContainer,IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


/**
 * Generated class for the AdminBodegasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-admin-bodegas',
  templateUrl: 'admin-bodegas.html',
})
export class AdminBodegasPage {
  
  myForm: FormGroup;
  public boton: string = "";
  private id;
  private variable;
  private direccion:string="";
  private id_sucursal;
  private arreglo: any = [];

  constructor(    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private inventarioPrd: InventarioProvider,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl:ToastController,
    private usuariosPrd: UsuariosProvider) {

      this.variable = this.parametros.get("parametro");
      this.id_sucursal = usuariosPrd.getSucursal();
  
      this.boton = "INSERTAR";
      if (this.variable == undefined) {
        const obj = { nombre: "" }
        this.myForm = this.createMyForm(obj);
      } else {
  
        this.id = this.variable.id_bodega;
        this.myForm = this.createMyForm(this.variable);
      }

  }
  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre_bodega:[obj.nombre, Validators.required],
      ubicacion_bodega:[obj.ubicacion, Validators.required],
      responsable_bodega:[obj.responsable, Validators.required],
      tiempo_real:[obj.tiempo_real, Validators.required],
    });
  }

  saveData() {
    let obj = this.myForm.value;
    
    let nombre_bodega = obj.nombre_bodega;
    let ubicacion_bodega = obj.ubicacion_bodega;
    let responsable_bodega = obj.responsable_bodega;
    let tiempo_real = obj.tiempo_real;
    let id_sucursal= this.id_sucursal;
    



    let enviarObjeto = {

      nombre_bodega:nombre_bodega,
      ubicacion_bodega:ubicacion_bodega,
      responsable_bodega:responsable_bodega,
      tiempo_real:tiempo_real,
    id_sucursal:id_sucursal,
    id_bodega:0,

    };

if (this.boton == "Actualizar") {
  enviarObjeto.id_bodega = this.variable.id_bodega;      
    this.inventarioPrd.modificar(enviarObjeto).subscribe(datos => {
    let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
    toas.present();
    });
} else {
   this.inventarioPrd.insertarBodega(enviarObjeto).subscribe(datos => {

     let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
     toas.present();
     this.navCtrl.pop();
   });
}
  }

}
