import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, App, Platform } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Injectable()
export class GlobalesProvider {
  private configuraciones;
  private objCualquiera;
  constructor(public http: HttpClient, private alertCtrl: AlertController, private appCtrl: App,
    private storage: Storage, private bt: BluetoothSerial, private platform: Platform) {

  }

  public cerrarAplicacion() {
    let alerta = this.alertCtrl.create({
      message: "¿Deseas salir de la aplicación?", subTitle: "Aviso",
      buttons: [{
        text: "Si", handler: () => {
          this.appCtrl.getRootNavs()[1].setRoot(LoginPage);
          this.storage.set("logeado", false);
        }
      }, "No"]
    });
    alerta.present();

  }

  public getConfiguraciones() {
    return this.configuraciones;
  }

  public isSemiOnline(){
    if( this.configuraciones == undefined){
       return false;
    }else
    return this.configuraciones.semionline == undefined || this.configuraciones.semionline == null ? false:this.configuraciones.semionline;
  }

  public setConfiguraciones(obj) {
    this.configuraciones = obj;
  }

  public valida(obj): boolean {

    let validado: boolean = false;
    if (obj != null || obj != undefined) {

      validado = true;
    }
    return validado;
  }


  public conectarCajero(mensaje) {
    let isDiscconnected = false;
    if(this.configuraciones != undefined && this.configuraciones != null){
      isDiscconnected = this.configuraciones.disconected == undefined ? false : this.configuraciones.disconected;
    }

    var promesa = new Promise((resolver, errores) => {

      
      if(this.platform.is("cordova")){
        try {
          this.storage.get("cajero").then(configuracionimpresora => {

            if(configuracionimpresora != null){
              this.bt.isConnected().then(() => {
                this.bt.disconnect().then(conectado => {
                  let mac = configuracionimpresora.mac;
                  this.bt.connect(mac).subscribe(datosconectador => {
                    this.bt.write(mensaje).then(aceptaEscribir=>{
                      if(!isDiscconnected){
                        this.bt.disconnect().then(desconectabt => {
                          resolver("Se resuelve");
                        }).catch(errorDesconectar => {
                          errores("Error al desconectar despues de escribir");
                        });
                      }else{
                        resolver("Se resuelve");
                      }
                    }).catch(errorEscribir=>{
                      errores("No se pudo escribir");
                    });
                  }, error => {
                    errores("No se pudo conectar");
                  });
                }).catch(disconecteerror => {
                  errores("No se pudo desconectar");
                });
              }).catch(() => {
                let mac = configuracionimpresora.mac;
                this.bt.connect(mac).subscribe(datosconectador => {
                  this.bt.write(mensaje).then(aceptaEscribir=>{
                    if(!isDiscconnected){
                      this.bt.disconnect().then(desconectabt => {
                        resolver("Se resuelve");
                      }).catch(errorDesconectar => {
                        errores("Error al desconectar despues de escribir");
                      });
                    }else{
                      resolver("Se resuelve");
                    }
                  }).catch(errorEscribir=>{
                    errores("No se pudo escribir");
                  });
                }, error => {
                  errores("No se pudo desconectar");
                });
  
              });

            }else{
              errores("No hay impresora");
            }

          }).catch(error => {
            errores("Hay error no existe mac de impresora");
          });
        } catch{
          errores("Entro en el catch");
        }
      

      }else{

        errores("No es cordova");
      }

    });


    return promesa;
  }

  public conectarCocina(mensaje) {
    let isDiscconnected = false;
    if(this.configuraciones != undefined && this.configuraciones != null){
      isDiscconnected = this.configuraciones.disconected == undefined ? false : this.configuraciones.disconected;
    }

  


    var promesa = new Promise((resolver, errores) => {

      
      if(this.platform.is("cordova")){
        try {
          this.storage.get("cocina").then(configuracionimpresora => {

            if(configuracionimpresora != null){
              this.bt.isConnected().then(() => {
                this.bt.disconnect().then(conectado => {
                  let mac = configuracionimpresora.mac;
                  this.bt.connect(mac).subscribe(datosconectador => {
                    this.bt.write(mensaje).then(aceptaEscribir=>{
                      if(!isDiscconnected){
                        this.bt.disconnect().then(desconectabt => {
                          resolver("Se resuelve");
                        }).catch(errorDesconectar => {
                          errores("Error al desconectar despues de escribir");
                        });
                      }else{
                        resolver("Se resuelve");
                      }
                    }).catch(errorEscribir=>{
                      errores("No se pudo escribir");
                    });
                  }, error => {
                    errores("No se pudo conectar");
                  });
                }).catch(disconecteerror => {
                  errores("No se pudo desconectar");
                });
              }).catch(() => {
                let mac = configuracionimpresora.mac;
                this.bt.connect(mac).subscribe(datosconectador => {
                  this.bt.write(mensaje).then(aceptaEscribir=>{
                  
                    if(!isDiscconnected){
                      this.bt.disconnect().then(desconectabt => {
                        resolver("Se resuelve");
                      }).catch(errorDesconectar => {
                        errores("Error al desconectar despues de escribir");
                      });
                    }else{
                      resolver("Se resuelve");
                    }
                  }).catch(errorEscribir=>{
                    errores("No se pudo escribir");
                  });
                }, error => {
                  errores("No se pudo desconectar");
                });
  
              });

            }else{
              errores("No hay impresora");
            }

          }).catch(error => {
            errores("Hay error no existe mac de impresora");
          });
        } catch{
          errores("Entro en el catch");
        }
      

      }else{

        errores("No es cordova");
      }

    });


    return promesa;
  }

  public conectarBarra(mensaje) {

    let isDiscconnected = false;
    if(this.configuraciones != undefined && this.configuraciones != null){
      isDiscconnected = this.configuraciones.disconected == undefined ? false : this.configuraciones.disconected;
    }

    var promesa = new Promise((resolver, errores) => {

      
      if(this.platform.is("cordova")){
        try {
          this.storage.get("barra").then(configuracionimpresora => {

            if(configuracionimpresora != null){
              this.bt.isConnected().then(() => {
                this.bt.disconnect().then(conectado => {
                  let mac = configuracionimpresora.mac;
                  this.bt.connect(mac).subscribe(datosconectador => {
                    this.bt.write(mensaje).then(aceptaEscribir=>{
                      if(!isDiscconnected){
                        this.bt.disconnect().then(desconectabt => {
                          resolver("Se resuelve");
                        }).catch(errorDesconectar => {
                          errores("Error al desconectar despues de escribir");
                        });
                      }else{
                        resolver("Se resuelve");
                      }
                    }).catch(errorEscribir=>{
                      errores("No se pudo escribir");
                    });
                  }, error => {
                    errores("No se pudo conectar");
                  });
                }).catch(disconecteerror => {
                  errores("No se pudo desconectar");
                });
              }).catch(() => {
                let mac = configuracionimpresora.mac;
                this.bt.connect(mac).subscribe(datosconectador => {
                  this.bt.write(mensaje).then(aceptaEscribir=>{
                    if(!isDiscconnected){
                      this.bt.disconnect().then(desconectabt => {
                        resolver("Se resuelve");
                      }).catch(errorDesconectar => {
                        errores("Error al desconectar despues de escribir");
                      });
                    }else{
                      resolver("Se resuelve");
                    }
                  }).catch(errorEscribir=>{
                    errores("No se pudo escribir");
                  });
                }, error => {
                  errores("No se pudo desconectar");
                });
  
              });

            }else{
              errores("No hay impresora");
            }

          }).catch(error => {
            errores("Hay error no existe mac de impresora");
          });
        } catch{
          errores("Entro en el catch");
        }
      

      }else{

        errores("No es cordova");
      }

    });


    return promesa;
  }


  public setObjeto(obj){
    this.objCualquiera = obj;
  }

  public getObjeto(){
    return this.objCualquiera;
  }

}
