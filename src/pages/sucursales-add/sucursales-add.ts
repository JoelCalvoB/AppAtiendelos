import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SucursalesProvider } from '../../providers/sucursales/sucursales';

/**
 * Generated class for the SucursalesAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sucursales-add',
  templateUrl: 'sucursales-add.html',
})
export class SucursalesAddPage {

  myForm: FormGroup;
  public boton: string = "";
  public arregloCarrito: any = [];
  private variable;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl:ToastController,
    private sucursalesPrd:SucursalesProvider
  ) {
    this.variable = this.parametros.get("parametro");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { direccion: "", nombre: "" }
      this.myForm = this.createMyForm(obj);
    } else {
      this.myForm = this.createMyForm(this.variable);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      direccion: [obj.direccion, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let nombre = obj.nombre;
    let direccion = obj.direccion;
    



    obj = {
      nombre: nombre,
      direccion: direccion
    }
    
    if (this.boton == "Actualizar") {
        obj.id = this.variable.id;      
        this.sucursalesPrd.modificar(obj).subscribe(datos => {
        let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
        toas.present();
        });
    } else {
       this.sucursalesPrd.insertar(obj).subscribe(datos => {

         let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
         toas.present();
       });
    }

    this.navCtrl.pop();
  }

}
