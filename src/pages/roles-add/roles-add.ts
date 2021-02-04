import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesProvider } from '../../providers/roles/roles';

/**
 * Generated class for the RolesAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-roles-add',
  templateUrl: 'roles-add.html',
})
export class RolesAddPage {

  myForm: FormGroup;
  public boton: string = "";
  public arregloCarrito: any = [];
  private variable;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl: ToastController,
    private rolesPrd: RolesProvider
  ) {
    this.variable = this.parametros.get("parametro");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { rol: "", descripcion: "" }
      this.myForm = this.createMyForm(obj);
    } else {
      this.myForm = this.createMyForm(this.variable);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      rol: [obj.rol, Validators.required],
      descripcion: [obj.descripcion, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let rol = obj.rol;
    let descripcion = obj.descripcion;




    obj = {
      rol: rol,
      descripcion: descripcion
    }

    if (this.boton == "Actualizar") {
      obj.id = this.variable.id;
      this.rolesPrd.modificar(obj).subscribe(datos => {
        let toas = this.toasCtrl.create({ message: "Registro actualizado correctamente", duration: 1500 });
        toas.present();
      });
    } else {
      this.rolesPrd.insertar(obj).subscribe(datos => {

        let toas = this.toasCtrl.create({ message: "Registro insertado correctamente", duration: 1500 });
        toas.present();
      });
    }

    this.navCtrl.pop();
  }


}
