import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';


@Component({
  selector: 'page-productos-promociones-modalproductos',
  templateUrl: 'productos-promociones-modalproductos.html',
})
export class ProductosPromocionesModalproductosPage {

  public arreglo:any = [];
  public idCategoria;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
  private productoPrd:ProductosProvider) {
    let categoria = navParams.get("categoria");
    this.idCategoria = categoria.id;
    
    this.productoPrd.getProductosCategoria(this.idCategoria).subscribe(datos =>{
      for(let item of datos){
          item.cantidad = 1;
          item.seleccionado = false;
          if(categoria.productos != undefined){
            for(let categoriaproducto of categoria.productos){
              if(categoriaproducto.id_producto == item.id_producto){
                  item.cantidad = categoriaproducto.cantidad;
                  item.seleccionado = categoriaproducto.seleccionado;
              }
            }
          }
      }

      this.arreglo = datos;
    });    
  }

  ionViewDidLoad() {
    
  }


  public salir(){
     this.viewCtrl.dismiss();
  }

  public restar(indice): any {
    let cantidad = this.arreglo[indice].cantidad;
    if (cantidad == 1)
      cantidad = 1;
    else
      cantidad = cantidad - 1;

    this.arreglo[indice].cantidad = cantidad;
  }

  public sumar(indice): any {
    let cantidad = this.arreglo[indice].cantidad;
    cantidad = cantidad + 1;
    this.arreglo[indice].cantidad = cantidad;

  }

  public guardarCambios(){
      let arregloPrincipal: any = [];
      for(let item of this.arreglo){
        item.ruta_imagen = "";
        if(item.seleccionado == true){
            arregloPrincipal.push(item);
        }
      }

    
      this.viewCtrl.dismiss({arreglo:arregloPrincipal,id_categoria:this.idCategoria});
  }

}
