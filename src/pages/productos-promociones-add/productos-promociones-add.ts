import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, FabContainer, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromocionesProvider } from '../../providers/promociones/promociones';
import { ProductosCategoriaPage } from '../productos-categoria/productos-categoria';
import { GlobalesProvider } from '../../providers/globales/globales';


/**
 * Generated class for the ProductosPromocionesAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-productos-promociones-add',
  templateUrl: 'productos-promociones-add.html',
})
export class ProductosPromocionesAddPage {

  myForm: FormGroup;
  public boton: string = "";
  private id;
  private variable;
  public productos:any = [];
  public auxcategoriasproductos:any = [];

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private promocionesPrd: PromocionesProvider,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl: ToastController,
    private globales:GlobalesProvider,
    private modalCtrl:ModalController
  ) {
    this.variable = this.parametros.get("parametro");
    
    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { nombre: "", descripcion: "", precio: 0 }
      this.myForm = this.createMyForm(obj);
    } else {

      this.id = this.variable.id_inventario;
      this.variable.productos = this.variable.productos == undefined ? [] : this.variable.productos;
      if(this.variable.productos.length != 0){
        this.auxcategoriasproductos = JSON.parse(this.variable.productos);
      }
      let produaxu:any =[];
      for(let item of this.auxcategoriasproductos){
        if(item.productos != undefined){
          for(let i of item.productos){
              produaxu.push(i);
          }
        }
      }

      this.productos = produaxu;

      this.myForm = this.createMyForm(this.variable);
    }
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      dias: [obj.dias, Validators.required],
      inicio: [obj.inicia, Validators.required],
      fin: [obj.termina, Validators.required],
      precio: [obj.precio, Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let nombre = obj.nombre;
    let descripcion = obj.descripcion;
    let dias = obj.dias;
    let inicia = obj.inicio;
    let termina = obj.fin;
    let precio = obj.precio;


    let enviarProductos:any = [];

    for(let item of this.productos){
      let cadena = `${item.id_producto}:${item.cantidad}`;
      enviarProductos.push(cadena);
    }


    obj = {
      nombre: nombre,
      descripcion: descripcion,
      dias: dias,
      inicia: inicia,
      termina: termina,
      precio: precio,
      productos:JSON.stringify(this.auxcategoriasproductos),
      productoscodificado:enviarProductos
    }

    if (this.boton == "Actualizar") {
      obj.id = this.variable.id;
      this.promocionesPrd.modificar(obj).subscribe(datos => {
        let toas = this.toasCtrl.create({ message: "Registro actualizado correctamente", duration: 1500 });
        toas.present();
      });
    } else {
      this.promocionesPrd.insertar(obj).subscribe(datos => {

        let toas = this.toasCtrl.create({ message: "Registro insertado correctamente", duration: 1500 });
        toas.present();
      });
    }

    this.navCtrl.pop();
  }


  public agregarproductos(){
    let modal = this.modalCtrl.create(ProductosCategoriaPage,{esPromociones:true,productos:this.auxcategoriasproductos});
    modal.present();
    modal.onDidDismiss(datos =>{
      
      let produaxu:any =[];
      this.auxcategoriasproductos = datos;
      for(let item of datos){
        if(item.productos != undefined){
          for(let i of item.productos){
              produaxu.push(i);
          }
        }
      }
      this.productos = produaxu;
     
    });
  }



}
