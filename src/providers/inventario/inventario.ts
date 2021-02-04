import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

/*
  Generated class for the InventarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InventarioProvider {
  private id_sucursal;

  private direccion:string="";

  constructor(public http: HttpClient,    private usuariosPrd: UsuariosProvider
  ) {
    this.id_sucursal = usuariosPrd.getSucursal();

  }
  

  public gets():Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion);
  }

  public getsFolioOrden():Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"/folio");
  }

  public getsOrdenesCompra():Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"/lista/ordenes");
  }


  public getsProveedor():Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"proveedores");
  }

  public getsMedida():Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"/medidas");
  }

  public getsBodega(id_sucursal):Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"bodega/"+this.id_sucursal);
  }

  public getDesgloseOrden(folio):Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"/ordenes/"+folio);
  }

  public getsBodegaEspecifico(id_bodega):Observable<any>{
    this.direccion = direcciones.inventarios();
    return   this.http.get(this.direccion+"bodegaespecifico/"+id_bodega);
  }


  public insertar(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion,json,httpOptions);
  }

  
  public insertarOrdenCompra(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion+"/insertar/orden",json,httpOptions);
  }


  public insertarBodega(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion+"/bodega",json,httpOptions);
  }


  
  public insertarMedida(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.post(this.direccion+"/medida",json,httpOptions);
  }



  public insertarProveedor(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
   
    
    return this.http.post(this.direccion+"/proveedor",json,httpOptions);
  }


  public insertCorteInicial(sucursal , usuario , bodega):Observable<any>{
this.direccion= direcciones.inventarios();
return this.http.get(this.direccion+"/corteinicial/"+sucursal+"/"+usuario+"/"+bodega);

  };



  public CorteXsUc(sucursal , usuario , bodega):Observable<any>{
    this.direccion= direcciones.inventarios();
    return this.http.get(this.direccion+"/cortexsucursal/"+sucursal+"/"+usuario+"/"+bodega);
    
      };

  public modificar(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.put(this.direccion,json,httpOptions);
  }


  public modificarBodega(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.put(this.direccion+"/bodega",json,httpOptions);
  }



  public modificarProveedor(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    
    return this.http.put(this.direccion+"/proveedor",json,httpOptions);
  }


  public eliminar(id):Observable<any>{
    this.direccion = direcciones.inventarios();
    return this.http.delete(this.direccion+"/"+id);
   }

   
  public eliminarBodega(id):Observable<any>{
    this.direccion = direcciones.inventarios();
    return this.http.delete(this.direccion+"/bodega/"+id);
   }

   public eliminarProveedor(id):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    return this.http.delete(this.direccion+"/proveedores"+"/"+id);
   }

   public modificarajustesLista(obj):Observable<any>{
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);
    return this.http.put(this.direccion+"/ajustes/lista",json,httpOptions);
    
  }


  public getHistorialInventario(id_inventario,id_sucursal,id_ubicacion):Observable<any>{
    this.direccion = direcciones.inventarios();

    let direccionHistorial = `${this.direccion}/${id_inventario}/sucursal/${id_sucursal}/desglose/${id_ubicacion}`;
    
     return this.http.get(direccionHistorial);
  }
  public getCorte(id_inventario,id_sucursal):Observable<any>{
    this.direccion = direcciones.inventarios();

    let direccionHistorial = this.direccion+"/historial/"+id_inventario+"/"+id_sucursal;
     return this.http.get(direccionHistorial);
  }


  public insertarInventarioCorte(obj):Observable<any>{
   
    this.direccion = direcciones.inventarios();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    
    let json = JSON.stringify(obj);

    let direccionreal = this.direccion+"/corte_inventario";
    return this.http.post(direccionreal,json,httpOptions);
  }

}
