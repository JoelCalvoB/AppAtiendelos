import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, AlertController, ToastController } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';
import { ProductosProductosAddPage } from '../productos-productos-add/productos-productos-add';
import { GlobalesProvider } from '../../providers/globales/globales';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


@Component({
  selector: 'page-productos-productos',
  templateUrl: 'productos-productos.html',
})
export class ProductosProductosPage {

  public arreglo: any = [];
  public categoria;
  public esSubcategorias = false;
  public secuencia ;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private productosPrd: ProductosProvider, private alertaCtrl: AlertController, private toasCtrl: ToastController,
    private globales: GlobalesProvider,private usuariosPrd:UsuariosProvider) {

    this.categoria = navParams.get("categoria");
    this.esSubcategorias = navParams.get("esSubcategoria");
    this.secuencia = navParams.get("secuencia");
  }

  ionViewDidLoad() {
    this.traerproductos();
  }

  public traerproductos(): any {
    if(this.esSubcategorias != true){
      if(!this.usuariosPrd.getFree()){
        this.productosPrd.getProductosCategoria(this.categoria.id).subscribe(datos => {
          this.arreglo = datos;
          
        });
      }else{

      }
    }else{

     if(!this.usuariosPrd.getFree()){
      this.productosPrd.getProductosCategoriaSub(this.categoria.id,this.secuencia).subscribe(datos =>{
        this.arreglo = datos;
        
      });
     }
    }
  }

  ionViewDidEnter() {
    this.traerproductos();

  }
  public actualizando(refresher): any {
     if(this.esSubcategorias != true){
       if(!this.usuariosPrd.getFree()){
        this.productosPrd.getProductosCategoria(this.categoria.id).subscribe(datos => {
          this.arreglo = datos;
          refresher.complete();
        });
       }
    }else{
        if(!this.usuariosPrd.getFree()){
          this.productosPrd.getProductosCategoriaSub(this.categoria.id,this.secuencia).subscribe(datos =>{
            this.arreglo = datos;
            
            refresher.complete();
          });
        }
    };
    
  }

  public agregar() {
   let obj = {};
       this.navCtrl.push(ProductosProductosAddPage, { boton: "Agregar", id_categoria: this.categoria.id,subcategoria:this.secuencia,parametro: obj });
  }

  public actualizar(obj: any) {
    this.navCtrl.push(ProductosProductosAddPage, { parametro: obj, boton: "Actualizar" });
  }

  public eliminar(obj) {
    let id = obj.id_producto;
    let alerta = this.alertaCtrl.create({
      title: "Aviso", subTitle: "¿Deseas eliminar el registro?", buttons: [{
        text: "Aceptar", handler: () => {
          this.productosPrd.eliminar(id).subscribe(resp => {
            this.productosPrd.getProductos().subscribe(res => {
              this.arreglo = res;
            });
            let toas = this.toasCtrl.create({ message: "Registro Eliminado", duration: 1500 });
            toas.present();
          });

        }
      }, "Cancelar"]
    });


    alerta.present();

  }

  public salir() {
    this.globales.cerrarAplicacion();
  }
}
