import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';

/**
 * Generated class for the AgregaMobimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-agrega-mobimiento',
  templateUrl: 'agrega-mobimiento.html',
})
export class AgregaMobimientoPage {

  public arreglo:any = [];
  public inventarioElegido = [];
 
   constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
               private inventarioPrd:InventarioProvider) {
       this.inventarioElegido = navParams.get("inventario");
       let encontrado = false;
         inventarioPrd.gets().subscribe(datos =>{
               for(let i of datos){
                   for(let x of this.inventarioElegido){
                      if(x.id_inventario == i.id_inventario){
                          i.cantidad = x.cantidad;
                          i.elegido = true;
                          encontrado = true;
                          break;
                      }
                   }                 
                  if(!encontrado){
                   i.cantidad = 1;
                   i.elegido = false;
                   encontrado = false;
 
                  }
                  encontrado = false;
               }
               this.arreglo = datos;
 
           });
   }
 

 
   public salir():any{
     this.viewCtrl.dismiss({datos:null});
   }
 
   public getcantidad(indice): any {
     return this.arreglo[indice].cantidad;
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
 
 
   public hecho():any{
    let enviar = [];
    for(let item of this.arreglo){
      if(item.elegido){
          enviar.push(item);
      }
    }
    this.viewCtrl.dismiss({datos:enviar});
   }
}