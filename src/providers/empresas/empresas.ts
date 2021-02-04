import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones, ip } from '../../assets/direcciones';
import { Observable } from 'rxjs/observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class EmpresasProvider {

  private direccion = "";
  private empresa;

  constructor(public http: HttpClient,private storage:Storage) {
    this.direccion = direcciones.empresas;
  }


  public gets():Observable<any>{   
    return this.http.get(this.direccion);
   }
   public getEspecifico(id):Observable<any>{   
    return this.http.get(this.direccion+"/"+id);
   }

   public eliminar(id):Observable<any>{
    return this.http.delete(this.direccion+"/"+id);
   }
 
   public insertar(obj):Observable<any>{
     
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.post(this.direccion,json,httpOptions);
   }
 
   public modificar(obj):Observable<any>{
     
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
       })
     };
     
     let json = JSON.stringify(obj);
     return this.http.put(this.direccion,json,httpOptions);
   }


   public login(obj):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    

    let ruta = direcciones.administracion+"/login";

    let json = JSON.stringify(obj);
    return this.http.post(ruta,json,httpOptions);

   }


   
   public loginempresa(obj):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    

    let ruta = direcciones.administracion+"/login/empresa";

    let json = JSON.stringify(obj);
    return this.http.post(ruta,json,httpOptions);

   }

   public setEmpresa(obj){
    this.storage.set("empresa",obj);
   }


   public getEmpresa(){
     
    var promesa = new Promise((resuelve,noresuelve)=>{

      this.storage.get("empresa").then(dato =>{
         if(dato != undefined){
              resuelve(dato);
         }else{
                noresuelve(undefined);
         }
      }).catch(err =>{
          noresuelve(undefined);
      });
    })

    return promesa;
   }

   public version():Observable<any>{
     let url = ip+"/administracion/version";
     return this.http.get(url);
   }

}
