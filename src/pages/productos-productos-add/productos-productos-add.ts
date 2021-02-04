import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosProvider } from '../../providers/productos/productos';
import { CategoriasProvider } from '../../providers/categorias/categorias';
import { ProductosProductosListayoutubePage } from '../productos-productos-listayoutube/productos-productos-listayoutube';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ProductosProductosAddSubmenuPage } from '../productos-productos-add-submenu/productos-productos-add-submenu';



/**
 * Generated class for the ProductosProductosAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-productos-productos-add',
  templateUrl: 'productos-productos-add.html',
})
export class ProductosProductosAddPage {


  myForm: FormGroup;
  public boton: string = "";
  private id;
  public categoria: any = [];
  private variable;
  public video: any = "";
  public id_video;
  public imagen = "";
  public texto = "Imagen no seleccionada";
  public nueva: boolean = false;
  public subcategoria;
  public objMenu:any = [];
  private tipo_submenudesplegable:string = "";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl: ToastController,
    private productoscategoriasPrd: ProductosProvider,
    private catePrd: CategoriasProvider, private modal: ModalController,
    private camera: Camera
  ) {
    this.variable = this.parametros.get("parametro");
    this.subcategoria = this.parametros.get("subcategoria");

    


    this.objMenu = this.variable.lista_menudesplegable;
    this.tipo_submenudesplegable = this.variable.tipo_menudesplegable;

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      let id_categoria = this.parametros.get("id_categoria");
      
      const obj = { nombre: "", descripcion: "", precio: 0,id_categoria:id_categoria }
      this.myForm = this.createMyForm(obj);
    } else {

      this.id = this.variable.id;
      this.video = this.variable.nombre_video;
      this.imagen = this.variable.ruta_imagen;
      if(this.variable.ruta_imagen != undefined || this.variable.ruta_imagen != null){
        this.texto = (this.variable.ruta_imagen.length != 0) ? "Imagen seleccionada" : "Imagen no seleccionada";
      }else{
        this.texto = "Imagen no seleccionada";
      }
      this.myForm = this.createMyForm(this.variable);
    }

    this.catePrd.gets().subscribe(datos => {
      this.categoria = datos;
    });
  }

  private createMyForm(obj) {
    return this.formBuilder.group({
      nombre: [obj.nombre, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      precio: [obj.precio, Validators.required],
      categoria: [obj.id_categoria, Validators.required],
      video: [obj.nombre_video],
      tipobarra:[obj.notificacion,Validators.required]
    });
  }
  saveData() {
    let obj = this.myForm.value;
    let nombre = obj.nombre;
    let descripcion = obj.descripcion;
    let precio = obj.precio;
    let id_categoria = obj.categoria;
    let nombre_video = obj.video;
    let notifi = obj.tipobarra;

    obj = {
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      id_categoria: id_categoria,
      id_video: this.id_video,
      nombre_video: nombre_video,
      imagen:this.imagen,
      subirImagen:this.nueva,
      notificacion:notifi,
      subcategoria:this.subcategoria,
      menu_desplegable:this.objMenu,
      tipo_menuDesplegable:this.tipo_submenudesplegable
    }


    if (this.boton == "Actualizar") {
      obj.id_producto = this.variable.id_producto;
      this.productoscategoriasPrd.modificar(obj).subscribe(datos => {
        let toas = this.toasCtrl.create({ message: "Registro actualizado correctamente", duration: 1500 });
        toas.present();
      });
    } else {
      this.productoscategoriasPrd.insertar(obj).subscribe(datos => {

        let toas = this.toasCtrl.create({ message: "Registro insertado correctamente", duration: 1500 });
        toas.present();
      });
    }

    this.navCtrl.pop();
  }

  public agregarvideo(): any {
    let mo = this.modal.create(ProductosProductosListayoutubePage);
    mo.present();
    mo.onDidDismiss(datos => {
      if (datos == undefined) return;
      this.video = datos.nombre;
      this.id_video = datos.id;
    });

  }


  public subirFoto() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imagen =  imageData;
      this.nueva = true;
      this.texto = "Imagen seleccinada";

    }, (err) => {
      
    });
  }

  public galeria() {
  
    
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imagen =  imageData;
      this.nueva = true;
      this.texto = "Imagen seleccinada";

    }, (err) => {
      
    });
  }


  public agregarSubmenu() {
    let modal = this.modal.create(ProductosProductosAddSubmenuPage, { menu: this.objMenu },{
      cssClass:'margen_modal'
    });

    modal.present();
    modal.onDidDismiss(datos => {
     
      if (datos != undefined) {
        
        this.objMenu = datos.arreglo;
        this.tipo_submenudesplegable = datos.tipo;
      }
    });

  }

}
