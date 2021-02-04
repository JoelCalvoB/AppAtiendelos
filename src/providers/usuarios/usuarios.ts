import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController } from 'ionic-angular';
import { ProductosProvider } from '../../providers/productos/productos';
import { CategoriasProvider } from '../../providers/categorias/categorias';


/*
  Generated class for the UsuariosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuariosProvider {

  private direccion = "";
  private obj;
  private free;


  constructor(public http: HttpClient,private storage: Storage,private cargandoCtrl:LoadingController,
  private productosPrd:ProductosProvider,private categoriasPrd:CategoriasProvider,private toast:ToastController) {
    
  }

  public gets():Observable<any>{    
    this.direccion = direcciones.usuarios();
   return this.http.get(this.direccion);;
  }

  public ValidaPago(id_sucursal):Observable<any>{
    this.direccion = direcciones.usuarios();
    return this.http.get(this.direccion+"/status/"+id_sucursal);
  }

  public eliminar(id):Observable<any>{
    this.direccion = direcciones.usuarios();
   return this.http.delete(this.direccion+"/"+id);;
  }

  public insertar(obj):Observable<any>{
    this.direccion = direcciones.usuarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion,json,httpOptions);
  }

  public modificar(obj):Observable<any>{
    this.direccion = direcciones.usuarios();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.put(this.direccion,json,httpOptions);
  }

  public getListaUsuariosSucursal(id_sucursal):Observable<any>{
    this.direccion = direcciones.usuarios();
    return this.http.get(this.direccion+"/lista/"+id_sucursal);
  }

  public ingresarSistema(obj): Observable<any> {
    this.direccion = direcciones.usuarios();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let url = this.direccion + "/login";
    let json = JSON.stringify(obj);
    return this.http.post(url, json, httpOptions);
  }


  public reactivando():Observable<any>{
    this.direccion = direcciones.usuarios();
    return this.http.get(`${this.direccion}/reactivando`);
  }

  public guardarUsuario(obj,cargarCatalogos) {
    this.obj = obj;
    if(cargarCatalogos == true){

      this.storage.get("listaproductosdetallemesa").then(listaProductos =>{


        if(listaProductos == undefined){
          let cargando = this.cargandoCtrl.create({content:"Cargando catalogo de productos"});
          cargando.present();
          this.productosPrd.getCategoriaConListaproductos().subscribe(listadoproductos => {
           
            this.categoriasPrd.gets().subscribe(categorias=>{
               let objetoGuardar = {
                 categorias:categorias,
                 listaproductos:listadoproductos
               };
      
               this.storage.set("listaproductosdetallemesa",objetoGuardar);
               cargando.dismiss();
            });
          });
        }else{
          let load = this.cargandoCtrl.create({content:"Activando servicio"});
          load.present();
          this.reactivando().subscribe(datos =>{
            load.dismiss();
            let toast = this.toast.create({message:"Servicios en línea",duration:1500});
            toast.present();
          },err =>{
            let toast = this.toast.create({message:"Error al iniciar el servicio, cerrar y abrir la app",showCloseButton:true});
            toast.present();
          });
        }

      });
    }
  }

  public getUsuario() {
    return this.obj;
  }

  public getSucursal(){
    return this.obj.id_sucursal;
  }

  public getIdUsuario(){
    return this.obj.id;
  }

  public activarMenu(): boolean {
    return this.obj.menu;
  }
  public activarCatalogos(): boolean {
    return this.obj.catalogos;
  }
  public activarBar(): boolean {
    return this.obj.bar;
  }
  public activarCocina(): boolean {
    return this.obj.cocina;
  }
  public activarTransacciones(): boolean {
    return this.obj.transacciones;
  }

  public activarCuentas():boolean{
    return this.obj.cuentas;
  }


  public activarInicio():boolean{
    return this.obj.inicio;
  }
  public activarGestionUsuarios():boolean{
    return this.obj.gestion_usuarios;
  }
  public activarSucursales():boolean{
    return this.obj.sucursales;
  }
  public activarMesas():boolean{
    return this.obj.mesas;
  }
  public activarCaja():boolean{
        return this.obj.caja;
  }
  public activarProductos():boolean{
    return this.obj.productos;
  }
  public activarHistorialCuentas():boolean{
    return this.obj.historial_cuentas;
  }
  public activarReportes():boolean{
    return this.obj.reportes;
  }
  public activarAutorizar():boolean{
    return this.obj.autorizar;
  }
  public activarInventarios():boolean{
    return this.obj.inventario;
  }
  public activarConfiguraciones():boolean{
    return this.obj.configuraciones;
  }

 public iniciar_en(){
   return this.obj.iniciar_en;
 }


  

  public getNombreUsuario(){
    return this.obj.nombre;
  }

  public esCapitanMesero(){
      return this.obj.capitan;
  }


  public isFree(objfree){
    this.free = objfree;
  }

  public getFree():boolean{
    let ff = this.free == undefined ? false:this.free;
    return ff;
  }
  
}
