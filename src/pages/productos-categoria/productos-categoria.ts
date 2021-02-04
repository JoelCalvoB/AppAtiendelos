import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,FabContainer,AlertController,ToastController,ModalController, ViewController} from 'ionic-angular';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { ProductosCategoriaAddPage } from '../productos-categoria-add/productos-categoria-add';
import { ProductosProductosPage } from '../productos-productos/productos-productos';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ProductosPromocionesModalproductosPage } from '../productos-promociones-modalproductos/productos-promociones-modalproductos';
import { ProductosCategoriaSubPage } from '../productos-categoria-sub/productos-categoria-sub';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-productos-categoria',
  templateUrl: 'productos-categoria.html',
})
export class ProductosCategoriaPage {

  public arreglo:any = [];
  public mostrarBoton:boolean = false;
  public mostrarBotonPromociones:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private categoriasPrd:CategoriasProvider,private alertaCtrl:AlertController,private toasCtrl:ToastController,
private globales:GlobalesProvider,private modalCtrl:ModalController,private viewCtrl:ViewController,private usuariosPrd:UsuariosProvider,
private storagePrd:Storage) {
    let productos = navParams.get("productos");
    productos = productos == undefined ? [] : productos;
    
    if(productos.length == 0){
      this.trerCarritos();
    }else{
      this.arreglo = productos;
    }

    this.mostrarBoton = navParams.get("esProductos");
    let auxpromociones = navParams.get("esPromociones");
    this.mostrarBotonPromociones = auxpromociones == undefined ? false : auxpromociones;
     

   
   
  }

  ionViewDidLoad() {
  }

 public trerCarritos():any{
     if(!this.usuariosPrd.getFree()){
      this.categoriasPrd.gets().subscribe(datos => {
        this.arreglo = datos;
      });
     }else{
         this.storagePrd.get("categorias").then(datos =>{
           if(datos != null || datos != undefined){
        
              this.arreglo = datos;
           }else{
             this.arreglo = [];
             
             this.storagePrd.set("categorias",this.arreglo);
           }
         });
     }
 }

  ionViewDidEnter(){
    if(this.mostrarBotonPromociones != true){
      this.trerCarritos();
    }

  }
  public actualizando(refresher): any {
    if(!this.usuariosPrd.getFree()){
      this.categoriasPrd.gets().subscribe(res => {
        this.arreglo = res;
        refresher.complete();
      });
    }else{
      this.storagePrd.get("categorias").then(datos =>{
        if(datos != null || datos != undefined){
           this.arreglo = datos;
        }else{
          this.arreglo = [];
        }
        refresher.complete();
      });
    }
  }

  public agregar(){
      this.navCtrl.push(ProductosCategoriaAddPage,{boton:"Agregar"});
  }

  public actualizar(obj:any,indice){
    this.navCtrl.push(ProductosCategoriaAddPage,{parametro:obj,boton:"Actualizar",indice:indice});
  }

  public eliminar(obj,indice){
     let id = obj.id;
     let alerta = this.alertaCtrl.create({title:"Aviso",subTitle:"¿Deseas eliminar el registro?",buttons:[{text:"Aceptar",handler:()=>{
     

      if(!this.usuariosPrd.getFree()){
        this.categoriasPrd.eliminar(id).subscribe(resp => {
          this.categoriasPrd.gets().subscribe(res => {
            this.arreglo = res;
          });
          let toas = this.toasCtrl.create({message:"Registro Eliminado",duration:1500});
          toas.present();
       });
      }else{
        this.arreglo.splice(indice,1);
        this.storagePrd.set("categorias",this.arreglo);
      }

     }},"Cancelar"]});
     

     alerta.present();

  }



  public abrirproductos(obj){
    
    if(obj.submenu){
      this.navCtrl.push(ProductosCategoriaSubPage,{categoria:obj});
    }else{
      this.navCtrl.push(ProductosProductosPage,{categoria:obj});
    }
  }

  public abrirModalPromociones(obj){
     let modal = this.modalCtrl.create(ProductosPromocionesModalproductosPage,{categoria:obj});
     modal.present();
     modal.onDidDismiss(datos => {
        if(datos != undefined){
          for(let item of this.arreglo){
              if(item.id == datos.id_categoria){
                item.productos = datos.arreglo;
                break;
              }
          }
        }

     });
  }

  public salir(){
    this.viewCtrl.dismiss(this.arreglo);
  }

}
