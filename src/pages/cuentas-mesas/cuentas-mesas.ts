import { Component } from '@angular/core';
import {  NavController, NavParams,ViewController,AlertController,LoadingController } from 'ionic-angular';
import { MesasProvider } from '../../providers/mesas/mesas';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { Storage } from '@ionic/storage';
import { GlobalesProvider } from '../../providers/globales/globales';

/**
 * Generated class for the CuentasMesasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-cuentas-mesas',
  templateUrl: 'cuentas-mesas.html',
})
export class CuentasMesasPage {

  public arreglo = [];
  public indice = -1;
  public unir:boolean = false;
  private desabilitar:boolean = false;
  private unircuentas:boolean=false;
  private mesa = {id_mesa:0};
  private visualizaMesas:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private mesasPrd: MesasProvider,private viewCtrl:ViewController,private loadCtrl:LoadingController,private ticketsprd:TicketsProvider,private usuarios:UsuariosProvider,
  private alertCtrl:AlertController,private storage:Storage,private globales:GlobalesProvider) {
     if(!this.usuarios.getFree() && !this.globales.isSemiOnline()){
      let sucursal = navParams.get("id_sucursal");
      this.desabilitar = navParams.get("desabilitar");
      this.unircuentas = navParams.get("unircuentas");
      this.mesa = navParams.get("ticket");
  
      
  
      this.desabilitar = this.desabilitar == undefined ? false:this.desabilitar;
      this.unircuentas = this.unircuentas == undefined ? false:this.unircuentas;
  
      if(this.unircuentas){
         this.unir = true;
      }
  
      let cargando = this.loadCtrl.create({content:"Cargando mesas"});
      cargando.present();
  
      if(!this.desabilitar && !this.unircuentas){
        this.mesasPrd.getActivosResumidos(sucursal,0).subscribe(datos => {
          for (let item of datos)
            item.colorear = item.ocupada;
          this.arreglo = datos;
    
    
          cargando.dismiss();
        },err =>{
          cargando.dismiss();
        });
      }else{
         
        this.visualizaMesas = true;
        this.ticketsprd.getActivosUsuarioEspecificoPorTicket(sucursal, 0).subscribe(datos => {
  
          for (let item of datos) {
            item.ocupada = true;
            item.colorear = true;
          }
          this.arreglo = datos;
  
          if(this.mesa != undefined){
            let contador = 0;
                for(let item of datos ){
                    if(this.mesa.id_mesa == item.id_mesa){
                        break;
                    }
  
                    contador = contador + 1;
                }
  
                this.arreglo.splice(contador,1);
          }
  
          cargando.dismiss();
        });
    
      }
     }else{



           let arregloAux = this.usuarios.getUsuario().mesasestablecimiento;
           
           if(arregloAux.length == 0){
               let alerta = this.alertCtrl.create({subTitle:"¿Sin mesas en el sistema",message:"Ingresar la cantidad de mesas para el establecimiento",
              inputs:[{type:"number",placeholder:"Cantidad de mesas",name:"nomesas"}],buttons:[{text:"Aceptar",handler:(datos =>{
                   let numeroMaximo = datos.nomesas;
                   for(let x=0; x < numeroMaximo; x++){
                      let item = {
                        id_mesa:(x+1),
                        nombre:`Mesa ${x+1}`,
                        ocupada:false,
                        id_tipo:1,
                      }

                      this.arreglo.push(item);
                   }


                   let objuser = this.usuarios.getUsuario();
                   objuser.mesasestablecimiento = this.arreglo;
                   this.storage.set("userfree",objuser);
                   this.usuarios.guardarUsuario(objuser,false);



                   for (let item of this.arreglo) {
                    item.ocupada = false;
                    item.colorear = false;
                  }

                   
              })},"Cancelar"]});

              alerta.present();
           }else{
              for(let item of arregloAux){
                  if(!item.ocupada){
                    this.arreglo.push(item);
                  }
              }
           }
     }
  }

  ionViewDidLoad() {
    this.indice = -1;
  }

  public marcar(indice) {
    if(!this.unir){
      for (let item of this.arreglo) {
        item.clase = false;
        item.colorear = item.ocupada;
      }
    }

    this.arreglo[indice].colorear = false;
    this.arreglo[indice].clase = !this.arreglo[indice].clase;



    this.indice = indice;
  }


  public dobleClick(){

    this.agregarMesa();
  }

  public salir() {
    this.viewCtrl.dismiss();
  }

  public agregarMesa():any{
    if(!this.unir){
      this.viewCtrl.dismiss({mesa:this.arreglo[this.indice],unir:false});
    }else{
      let primero = true;
      let mesa = null;
      let tipo = "";
      let mesasAfectadas = [];
      for(let item of this.arreglo){
        if(item.clase == true){
          if(item.id_tipo == 1){
              tipo = "Mesa";
          }
          if(primero){
            mesa = item;
            mesa.nombre = tipo + " "+mesa.id_mesa;
            primero = false;
            mesasAfectadas.push(mesa.id_mesa);
          }else{
            mesa.nombre = mesa.nombre + ","+tipo+" "+item.id_mesa;
            mesasAfectadas.push(item.id_mesa);
          }
        }
      }

      mesa.mesafusionada = mesa.id_mesa;
      mesa.mesasAfectadas = mesasAfectadas;
      this.viewCtrl.dismiss({mesa:mesa,unir:true});
    }
  }


  public toogle(){
    
    for (let item of this.arreglo) {
      item.clase = false;
      item.colorear = item.ocupada;
    }
  }

  private offset = 0;
  doInfinite(): Promise<any> {

    return new Promise((resolve) => {
      if(!this.usuarios.getFree()){
        let sucursal = this.navParams.get("id_sucursal");
        this.offset = this.offset + 20;
         if(!this.desabilitar){
          this.mesasPrd.getActivosResumidos(sucursal,this.offset).subscribe(datos =>{
            for(let item of datos){
             this.arreglo.push(item);
            }
            resolve();
          });
         }
      }else{
        resolve();
      }
    })
  }


  public unircuentasMetodos(){
        
   let mensaje = this.alertCtrl.create({message:"¿Deseas unir las cuentas seleccionadas?",buttons:[{text:"Si",handler:()=>{
     this.realizarUnirCuentas();
   }},'No']});
        
mensaje.present();
  }

  public realizarUnirCuentas(){
    let obj={
      ticket:this.mesa,
      cuentas:[]
    }

    for(let item of this.arreglo){
        if(item.clase == true){
            obj.cuentas.push(item);
        }
    }


    this.viewCtrl.dismiss(obj);

  }

}
