import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductosProvider } from '../../providers/productos/productos';
import { AgregaMobimientoPage } from '../agrega-mobimiento/agrega-mobimiento';
import { InventarioProvider } from '../../providers/inventario/inventario';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@Component({
  selector: 'page-ajuste-inventario',
  templateUrl: 'ajuste-inventario.html',
})
export class AjusteInventarioPage {

  private myForm: FormGroup;
  private inventario: any = [];
  private id: any = 0;
  private id_sucursal;
  public boton: string = "";
  private variable;
  private id_inventario;
  private obj;
  private id_usuario;
  private arreglo1: any = [];
  private ubic;



  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private parametros: NavParams,
    private toasCtrl: ToastController,
    private modalCtrl: ModalController,
    private productosPrd: ProductosProvider,
    private usuariosPrd: UsuariosProvider,
    private inventarioPrd: InventarioProvider,

  ) {
    this.variable = this.parametros.get("parametro");
    this.id_sucursal = usuariosPrd.getSucursal();  

    this.boton = this.parametros.get("boton");
    this.myForm = this.createMyForm({});

    this.inventarioPrd.getsBodega(this.id_sucursal).subscribe(otros =>{
      this.arreglo1 = otros;
    })
  }


  // NO BORRAR agregarinventario METODO QUE LLAMA CTALOGO ADICIONAL
  public agregarinventario(): any {
    let modal = this.modalCtrl.create(AgregaMobimientoPage, { inventario: this.inventario });
    modal.present();
    this.id_sucursal = this.usuariosPrd.getSucursal();
    this.id_usuario = this.usuariosPrd.getIdUsuario();

    modal.onDidDismiss(respuesta => {

     
      if(respuesta != undefined){
        respuesta = respuesta.datos;
        for (let item of respuesta) {
          item.cantidad = 0;
          
        }
  
        this.inventario = respuesta;
        
       

      }
    });

  }
  private createMyForm(obj) {
    return this.formBuilder.group({
      ubicacion: [obj.ubicacion, Validators.required],
      tipo_mov: [obj.tipo_mov, Validators.required],
      observaciones:[obj.observaciones],
      cantidad:0
    });
  }

  saveData() {
    let obj = this.myForm.value;
    let ubicacion = obj.ubicacion;
    this.ubic= obj.ubicacion;
        let tipo_mov = obj.tipo_mov;
    let id_inventario = this.id_inventario;
    let id_sucursal = obj.id_sucursal;
    let id_usuario = this.id_usuario;
    let observaciones=obj.observaciones;


    let controlMovimientos = [];

    for(let item of this.inventario){
        let control = {

          cantidad:item.cantidad,
          tipo_mov : tipo_mov,
          id_inventario : item.id_inventario,
          ubicacion:ubicacion,
          id_sucursal:this.usuariosPrd.getSucursal(),
          id_usuario:this.id_usuario,
          observaciones:observaciones,
        }
      
        controlMovimientos.push(control);
    }
     
  this.inventarioPrd.modificarajustesLista(controlMovimientos).subscribe(datos =>{

    this.inventarioPrd.insertCorteInicial(this.id_sucursal , this.id_usuario , this.ubic ).subscribe(data =>{

    })
      let toast = this.toasCtrl.create({message:"Registros en inventario registrados correctamente",duration:1500});
      toast.present();
      this.navCtrl.pop();
  });
  }
}
