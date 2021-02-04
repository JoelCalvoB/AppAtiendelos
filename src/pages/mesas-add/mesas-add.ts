import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController,FabContainer } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { RolesProvider } from '../../providers/roles/roles';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';
import { MesasProvider } from '../../providers/mesas/mesas';

/**
 * Generated class for the MesasAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-mesas-add',
  templateUrl: 'mesas-add.html',
})
export class MesasAddPage {

  myForm: FormGroup;
  public boton: string = "";
  public arregloRoles: any = [];
  public arregloCarrito: any = [];
  private variable;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private usuariosPrd: UsuariosProvider,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private rolesPrd: RolesProvider,
    private sucursalesPrd: SucursalesProvider,
    private toasCtrl:ToastController,
    private mesasPrd:MesasProvider
  ) {
    this.variable = this.parametros.get("parametro");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { id_mesa: "0"}
      this.myForm = this.createMyForm(obj);
    } else {
      
      this.myForm = this.createMyForm(this.variable);
    }
    this.rolesPrd.gets().subscribe(datos => {
      this.arregloRoles = datos;
    });
    this.sucursalesPrd.gets().subscribe(datos => {
      this.arregloCarrito = datos;
    });
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      id_mesa: [obj.id_mesa, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let id_mesa = obj.id_mesa;
    let id_sucursal = this.usuariosPrd.getSucursal();

    obj = {
      id_mesa: id_mesa,
      id_tipo:1,
      ocupada:false,
      id_sucursal:id_sucursal
    }
    
    if (this.boton == "Actualizar") {   
        this.usuariosPrd.modificar(obj).subscribe(datos => {
        let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
        toas.present();
        });
    } else {
       this.mesasPrd.insertar(obj).subscribe(datos => {
         let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
         toas.present();
       });
    }

    this.navCtrl.pop();
  }
  
}
