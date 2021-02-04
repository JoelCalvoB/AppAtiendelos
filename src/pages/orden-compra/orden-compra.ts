import { Component, ɵConsole } from '@angular/core';
import { NavController,ModalController, NavParams,ViewController, AlertController,ToastController,FabContainer } from 'ionic-angular';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { ConfiguracionEnlaceDetalleinventarioPage } from '../configuracion-enlace-detalleinventario/configuracion-enlace-detalleinventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { DatePipe } from '@angular/common';



/**
 * Generated class for the OrdenCompraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orden-compra',
  templateUrl: 'orden-compra.html',
})

export class OrdenCompraPage {

  private arreglo: any=[];
  public folio: string = "";
  public myDate:Date = new Date();;
  public fecha;



  myForm: FormGroup;
  public boton: string = "";
  private  inventario:any = [];
  private id:any = 0;
  private id_sucursal;
  private variable;
  private  arreglo1:any = [];
  public idusuario;



  constructor(public navCtrl: NavController,     private toasCtrl:ToastController,
    private modalCtrl:ModalController,
    public navParams: NavParams, private inventarioPrd: InventarioProvider,   
     public formBuilder: FormBuilder,
     private parametros: NavParams,
     private usuariosPrd: UsuariosProvider,
     private viewCtrl: ViewController,
     public datepipe: DatePipe

  ) {

    this.variable = this.parametros.get("parametro");
    this.id_sucursal = usuariosPrd.getSucursal();
    

    this.boton = "Insertar";
    if (this.variable == undefined) {
      const obj = { nombre: "", descripcion: "", precio: 0  }
      this.myForm = this.createMyForm(obj);

      this.myDate=new Date();
      this.fecha =this.datepipe.transform(this.myDate, "'date:'yyyy-MM-dd'");
      

    } else {

      this.id = this.variable.id_inventario;
      this.myForm = this.createMyForm(this.variable);
    }

    this.inventarioPrd.getsProveedor().subscribe(datos =>{
      this.arreglo = datos;
      
    })

    this.inventarioPrd.getsFolioOrden().subscribe(datosFolio=>{
     this.folio= datosFolio;

    })

    
    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(otros =>{
      this.arreglo1 = otros;
      

     this.idusuario= this.usuariosPrd.getIdUsuario();

    })
      
  }

  public agregarinventario():any{
    let modal = this.modalCtrl.create(ConfiguracionEnlaceDetalleinventarioPage,{inventario:this.inventario});
    modal.present();

    modal.onDidDismiss(respuesta => {
      respuesta = respuesta.datos;  
      for(let item of respuesta){
          item.id_producto = this.id;
        }
        this.inventario = respuesta; 

        
    });
}

private createMyForm(obj) {
  return this.formBuilder.group({
    folio:[obj.folio, Validators.required],
    fecha:[obj.fecha, Validators.required],
    elaboro:[obj.elaboro, Validators.required],
    ubicacion:[obj.ubicacion,Validators.required]
  });



}


saveData() {
  let fecha1 = this.fecha;


  let obj = this.myForm.value;
  let folio = obj.folio;
  let fecha= this.fecha;
  let elaboro=obj.elaboro;
  let ubicacion=obj.ubicacion
  let id_usuario=this.idusuario;
let id_sucursal= this.id_sucursal;


  let enviarObjeto = {

    folio:folio,
    fecha:fecha,
    elaboro:elaboro,
    ordenescompra:[],
    ubicacion:ubicacion,
    id_usuario:id_usuario,
    id_sucursal:id_sucursal
  };

  let arregloObj = [];
    for(let item of this.inventario){
      let obj2 = {
        id_inventario:item.id_inventario,
        cantidad:item.cantidad,
        unidad_medida:item.unidad_medida
            }
      
      arregloObj.push(obj2);

      
    }
   enviarObjeto.ordenescompra=arregloObj;



  
 
  

     this.inventarioPrd.insertarOrdenCompra(enviarObjeto).subscribe(datos => {

       let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
       toas.present();
       this.navCtrl.pop();
     });
  }
    
  public salir():any{
    this.viewCtrl.dismiss({datos:null});
  }

}
