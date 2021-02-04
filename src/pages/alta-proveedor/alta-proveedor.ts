import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController,FabContainer,IonicPage, DomController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

/**
 * Generated class for the AltaProveedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-alta-proveedor',
  templateUrl: 'alta-proveedor.html',
})
export class AltaProveedorPage {
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
         this.boton="ACTUALIZAR";
        this.id = this.variable.id_proveedor;
        this.myForm = this.createMyForm(this.variable);
      }
    
  }
  
  
  
  

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre:[obj.nombre, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      domicilio: [obj.domicilio, Validators.required],
      rfc: [obj.rfc, Validators.required],
      correo: [obj.correo, Validators.required],
      telefono: [obj.telefono, Validators.required],
      notas: [obj.notas, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    
    let nombre = obj.nombre;
    let descripcion = obj.descripcion;
    let domicilio = obj.domicilio;
    let rfc = obj.rfc;
    let correo = obj.correo;
    let telefono = obj.telefono;
    let notas = obj.notas;


    let enviarObjeto = {

      nombre:nombre,
      descripcion:descripcion,
      domicilio:domicilio,
      rfc:rfc,
      correo:correo,
      telefono:telefono,
      notas:notas,
      id_proveedor:0
    };

    if (this.boton == "ACTUALIZAR") {
      enviarObjeto.id_proveedor = this.variable.id_proveedor;      
        this.inventarioPrd.modificarProveedor(enviarObjeto).subscribe(datos => {
        let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
        toas.present();
        });
    } else {
       this.inventarioPrd.insertarProveedor(enviarObjeto).subscribe(datos => {
         let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
         toas.present();
       });
    }
    enviarObjeto=null;

    this.navCtrl.pop();
  }
}
