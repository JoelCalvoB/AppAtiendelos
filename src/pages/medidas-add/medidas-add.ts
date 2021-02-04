import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController,FabContainer,IonicPage, DomController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

/**
 * Generated class for the MedidasAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-medidas-add',
  templateUrl: 'medidas-add.html',
})
export class MedidasAddPage {

  myForm: FormGroup;
  public boton: string = "";
  private variable;
  private id_sucursal;
  private id;


  constructor( public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private inventarioPrd: InventarioProvider,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl:ToastController,
    private usuariosPrd: UsuariosProvider) {

      this.variable = this.parametros.get("parametro");
      this.id_sucursal = usuariosPrd.getSucursal();
      
  
      this.boton = this.parametros.get("boton");
      if (this.variable == undefined) {
        const obj = { nombre: "" }
        this.myForm = this.createMyForm(obj);
      } else {
         this.boton="INSERTAR";
        this.id = this.variable.id_proveedor;
        this.myForm = this.createMyForm(this.variable);
      }
      
    }


    private createMyForm(obj) {
      return this.formBuilder.group({
        nombre:[obj.nombre, Validators.required]
      });
    }
    saveData() {
      let obj = this.myForm.value;
      
      let nombre = obj.nombre;

  
  
      let enviarObjeto = {
  
        nombre:nombre,

      };
  
      if (this.boton == "Agregar") {
        
  
         this.inventarioPrd.insertarMedida(enviarObjeto).subscribe(datos => {
  
           let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
           toas.present();
         });
      }
  
      this.navCtrl.pop();
    }



}
