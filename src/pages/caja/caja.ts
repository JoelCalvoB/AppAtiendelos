import { Component } from '@angular/core';
import { CajaCorteInicioPage } from '../caja-corte-inicio/caja-corte-inicio';
import { CajaMesaPage } from '../caja-mesa/caja-mesa';
import { CajaEspecialPage } from '../caja-especial/caja-especial';
import { CuentasPage } from '../cuentas/cuentas';
import {AuditoriaDesglosePage}from '../auditoria-desglose/auditoria-desglose';


/**
 * Generated class for the CajaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-caja',
  templateUrl: 'caja.html',
})
export class CajaPage {
  tab1Root = CajaMesaPage;
  tab2Root = CajaCorteInicioPage;
  tab3Root = CajaEspecialPage;
  tab4Root = CuentasPage;
  tab5Root= AuditoriaDesglosePage;


  constructor() { }

  ionViewDidLoad() {
  }

}
