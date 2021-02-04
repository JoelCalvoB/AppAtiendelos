import { Component } from '@angular/core';

import { BarPage } from '../bar/bar';
import { CocinaPage } from '../cocina/cocina';
import { MenuPage } from '../menu/menu';
import { TransaccionesdiaPage } from '../transaccionesdia/transaccionesdia';
import { CuentasPage } from '../cuentas/cuentas';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { VentaseparadaPage } from '../ventaseparada/ventaseparada';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MenuPage;
  tab2Root = BarPage;
  tab3Root = CocinaPage;
  tab4Root = TransaccionesdiaPage;
  tab5Root = CuentasPage;
  tab6Root = VentaseparadaPage;
  capitan:boolean = false;

  constructor(private usuariosPrd:UsuariosProvider) {
      this.capitan = this.usuariosPrd.esCapitanMesero();
  }

  public bar():boolean{
    return this.usuariosPrd.activarBar() == true;
  }
  public catalogos():boolean{
    return this.usuariosPrd.activarCatalogos() == true;
  }
  public cocina():boolean{
    return this.usuariosPrd.activarCocina() == true;
  }
  public transacciones():boolean{
    return this.usuariosPrd.activarTransacciones() == true;
  }
  public cuentas():boolean{
    return this.usuariosPrd.activarCuentas() == true;
  }
  
}
