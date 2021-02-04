import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the ProductosCategoriaAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-productos-categoria-add',
  templateUrl: 'productos-categoria-add.html',
})
export class ProductosCategoriaAddPage {

  myForm: FormGroup;
  public boton: string = "";
  private id;
  public arregloRoles: any = [];
  public arregloCarrito: any = [];
  private variable;
  public submenuArreglo = [];
  

  public submenu: boolean = false;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl: ToastController,
    private productoscategoriasPrd: CategoriasProvider,private usuariosPrd:UsuariosProvider,
    private storagePrd:Storage
  ) {
    this.variable = this.parametros.get("parametro");
    this.id = this.parametros.get("indice");

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { nombre: "", descripcion: "", precio: 0, submenu: false }
      this.myForm = this.createMyForm(obj);
    } else {

      this.id = this.variable.id;
      this.myForm = this.createMyForm(this.variable);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      togle: obj.submenu
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let nombre = obj.nombre;
    let descripcion = obj.descripcion;
    let submenu = obj.togle;


    




    obj = {
      nombre: nombre,
      descripcion: descripcion,
      submenu:submenu,
      subcategorias:this.submenuArreglo
    }

    if (this.boton == "Actualizar") {
        if(!this.usuariosPrd.getFree()){
          obj.id = this.variable.id;
          this.productoscategoriasPrd.modificar(obj).subscribe(datos => {
            let toas = this.toasCtrl.create({ message: "Registro actualizado correctamente", duration: 1500 });
            toas.present();
          }, err => {
            
          });
        }else{
          this.storagePrd.get("categorias").then(datos =>{
            if(datos != null && datos != undefined){
             
                 datos.splice(this.id,0,obj);
                 this.storagePrd.set("categorias",datos);
                 let toas = this.toasCtrl.create({ message: "Categoría insertada correctamente", duration: 1500 });
                 toas.present();
            }
          });
        }
    } else {
      if(!this.usuariosPrd.getFree()){
        this.productoscategoriasPrd.insertar(obj).subscribe(datos => {

          let toas = this.toasCtrl.create({ message: "Categoría insertada correctamente", duration: 1500 });
          toas.present();
        }, err => {
          
        });
      }else{
           this.storagePrd.get("categorias").then(datos =>{
             if(datos != null && datos != undefined){
                  datos.push(obj);
                  this.storagePrd.set("categorias",datos);
                  let toas = this.toasCtrl.create({ message: "Categoría insertada correctamente", duration: 1500 });
                  toas.present();
             }
           });
      }
    }

    this.navCtrl.pop();
  }




  public addSalidas() {
    let alerta = this.alertCtrl.create({

      subTitle: "Agregando submenu",
      inputs: [{
        type: "text",
        name: "nombre",
        placeholder: "Nombre submenu", label: "Nombre salida"

      }], buttons: [{
        text: "Aceptar", handler: datos => {
          this.submenuArreglo.push(datos);
        }
      }]
    });
    alerta.present();
  }



  public eliminar(indice){
    this.submenuArreglo.splice(indice,1);
  }
}
