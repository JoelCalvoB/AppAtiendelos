import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresasProvider } from '../../providers/empresas/empresas';

/**
 * Generated class for the EmpresasAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-empresas-add',
  templateUrl: 'empresas-add.html',
})
export class EmpresasAddPage {
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
    private empresaPrd:EmpresasProvider
  ) {
    this.variable = this.parametros.get("parametro");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { nombre: "", descripcion: "",domicilio:"",usuario:"",password:"",inicio:"",fin:"",plan:"" }
      this.myForm = this.createMyForm(obj);
    } else {
      this.myForm = this.createMyForm(this.variable);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      domicilio: [obj.domicilio, Validators.required],
      usuario: [obj.usuario, Validators.required],
      password: [obj.password, Validators.required],
      inicio: [obj.inicio, Validators.required],
      fin: [obj.fin, Validators.required],
      plan: [obj.plan, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let nombre = obj.nombre;
    let descripcion = obj.descripcion;
    let domicilio = obj.domicilio;
    let usuario = obj.usuario;
    let password = obj.password;
    let inicio = obj.inicio;
    let fin = obj.fin;
    let plan = obj.plan;
    



    let enviarobj = {
      id:0,
      nombre: nombre,
      descripcion: descripcion,
      domicilio : domicilio,
      usuario:usuario,
      password:password,
      inicio:inicio,
      fin:fin,
      plan:plan
    }
    
    if (this.boton == "Actualizar") {
      enviarobj.id = this.variable.id;      
        this.empresaPrd.modificar(enviarobj).subscribe(datos => {
        let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
        toas.present();
        });
    } else {
       this.empresaPrd.insertar(enviarobj).subscribe(datos => {

         let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
         toas.present();
       });
    }

    this.navCtrl.pop();
  }


}
