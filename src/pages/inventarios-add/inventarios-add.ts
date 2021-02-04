import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ToastController,FabContainer } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';




/**
 * Generated class for the InventariosAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-inventarios-add',
  templateUrl: 'inventarios-add.html',
})
export class InventariosAddPage {

  myForm: FormGroup;
  public boton: string = "";
  private id;
  private variable;
  private direccion:string="";
  private id_sucursal;
  private arreglo: any = [];
  private arreglo1: any = [];
  private arregloMedidas:any[];




  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private inventarioPrd: InventarioProvider,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl:ToastController,
    private usuariosPrd: UsuariosProvider
  ) {
    this.variable = this.parametros.get("parametro");
    this.id_sucursal = usuariosPrd.getSucursal();
    

    this.boton = this.parametros.get("boton");
    if (this.variable == undefined) {
      const obj = { nombre: "", descripcion: "", precio: 0  }
      this.myForm = this.createMyForm(obj);
    } else {

      this.id = this.variable.id_inventario;
      this.myForm = this.createMyForm(this.variable);
    }

    this.inventarioPrd.getsProveedor().subscribe(datos =>{
      this.arreglo = datos;
      

    })

    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(otros =>{
      this.arreglo1 = otros;
      

    })

    this.inventarioPrd.getsMedida().subscribe(dat=>{
      this.arregloMedidas=dat;
    });
  }

  

  private createMyForm(obj) {
    return this.formBuilder.group({
      codigo:[obj.codigo, Validators.required],
      descripcion: [obj.descripcion, Validators.required],
      unidad: [obj.unidad_medida, Validators.required],
      proveedor: [obj.id_proveedor,Validators.required],
      minimo:[obj.minimo,Validators.required],
      categoria:[obj.categoria,Validators.required],
      ubicacion:[obj.ubicacion,Validators.required],
      costo:[obj.costo_unitario,Validators.required]
    });


  }
  saveData() {
    let obj = this.myForm.value;
    
    let unidad_medida = obj.unidad;
    let descripcion = obj.descripcion;
    let ubicacion = obj.ubicacion;
    let id_sucursal = this.id_sucursal;
    let categoria = obj.categoria;
    let minimo = obj.minimo;
    let codigo = obj.codigo;
    let id_proveedor = obj.proveedor;
    let costo_unitario = obj.costo;
    let cantidad = obj.cantidad;


    let enviarObjeto = {

      unidad_medida:unidad_medida,
      descripcion:descripcion,
      ubicacion:ubicacion,
      id_sucursal:id_sucursal,
      categoria:categoria,
      minimo:minimo,
      codigo:codigo,
      id_proveedor:id_proveedor,
      costo_unitario:costo_unitario,
      id_inventario:0,
      cantidad:cantidad
    };




    
    if (this.boton == "Actualizar") {
      enviarObjeto.id_inventario = this.variable.id_inventario;      
        this.inventarioPrd.modificar(enviarObjeto).subscribe(datos => {
        let toas = this.toasCtrl.create({message:"Registro actualizado correctamente",duration:1500});
        toas.present();
        });
    } else {
       this.inventarioPrd.insertar(enviarObjeto).subscribe(datos => {

         let toas = this.toasCtrl.create({message:"Registro insertado correctamente",duration:1500});
         toas.present();
         this.navCtrl.pop();
       });
    }
      
  }

 

  


}
