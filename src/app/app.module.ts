import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { Vibration } from '@ionic-native/vibration';
import { SMS } from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CurrencyPipe } from '@angular/common';
import { GooglePlus } from '@ionic-native/google-plus';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DatePipe } from '@angular/common';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PayPal } from '@ionic-native/paypal';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';



import { EstadisticaVentaxmesPage } from '../pages/estadistica-ventaxmes/estadistica-ventaxmes';
import { EstadisticaMeseroPage } from '../pages/estadistica-mesero/estadistica-mesero';
import { ControlMovimientoPage } from '../pages/control-movimiento/control-movimiento';
import { AgregaMobimientoPage } from '../pages/agrega-mobimiento/agrega-mobimiento'
import { BarPage } from '../pages/bar/bar';
import { CocinaPage } from '../pages/cocina/cocina';
import { MenuPage } from '../pages/menu/menu';
import { MenuSubPage } from '../pages/menu-sub/menu-sub';
import { MenuSubOrdenPage } from '../pages/menu-sub-orden/menu-sub-orden';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { TransaccionesdiaPage } from '../pages/transaccionesdia/transaccionesdia';
import { CuentasPage } from '../pages/cuentas/cuentas';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { UsuariosAddPage } from '../pages/usuarios-add/usuarios-add';
import { MesasPage } from '../pages/mesas/mesas';
import { ProductosPage } from '../pages/productos/productos';
import { SucursalesPage } from '../pages/sucursales/sucursales';
import { SucursalesAddPage } from '../pages/sucursales-add/sucursales-add';
import { RolesPage } from '../pages/roles/roles';
import { RolesAddPage } from '../pages/roles-add/roles-add';
import { CuentasDetallePage } from '../pages/cuentas-detalle/cuentas-detalle';
import { CuentasTotalPage } from '../pages/cuentas-total/cuentas-total';
import { CuentasResumenPage } from '../pages/cuentas-resumen/cuentas-resumen';
import { TicketsPage } from '../pages/tickets/tickets';
import { ProductosCategoriaPage } from '../pages/productos-categoria/productos-categoria';
import { ProductosProductosPage } from '../pages/productos-productos/productos-productos';
import { ProductosCategoriaAddPage } from '../pages/productos-categoria-add/productos-categoria-add';
import { ProductosProductosAddPage } from '../pages/productos-productos-add/productos-productos-add';
import { ProductosProductosListayoutubePage } from '../pages/productos-productos-listayoutube/productos-productos-listayoutube';
import { InventariosPage } from '../pages/inventarios/inventarios';
import { InventariosAddPage } from '../pages/inventarios-add/inventarios-add';
import { HistorialPage } from '../pages/historial/historial';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { ConfiguracionEnlaceProductoinventarioPage } from '../pages/configuracion-enlace-productoinventario/configuracion-enlace-productoinventario';
import { ConfiguracionEnlaceProductoinventarioAddPage } from '../pages/configuracion-enlace-productoinventario-add/configuracion-enlace-productoinventario-add';
import { ConfiguracionEnlaceDetalleinventarioPage } from '../pages/configuracion-enlace-detalleinventario/configuracion-enlace-detalleinventario';
import { CajaPage } from '../pages/caja/caja';
import { CajaCortePage } from '../pages/caja-corte/caja-corte';
import { CajaMesaPage } from '../pages/caja-mesa/caja-mesa';
import { CuentasMesasPage } from '../pages/cuentas-mesas/cuentas-mesas';
import { CuentaDetalleConfigPage } from '../pages/cuenta-detalle-config/cuenta-detalle-config';
import { BluetoothPage } from '../pages/bluetooth/bluetooth';
import { BluetoothDispositivosPage } from '../pages/bluetooth-dispositivos/bluetooth-dispositivos';
import { ReportesMenuPage } from '../pages/reportes-menu/reportes-menu';
import { ReportesVentaPage } from '../pages/reportes-venta/reportes-venta';
import { ReportesVentaFechaPage } from '../pages/reportes-venta-fecha/reportes-venta-fecha';
import { MesasAddPage } from '../pages/mesas-add/mesas-add';
import { CuentasDetalleAntesdeenviarPage } from '../pages/cuentas-detalle-antesdeenviar/cuentas-detalle-antesdeenviar';
import { GestionUsuariosPage } from '../pages/gestion-usuarios/gestion-usuarios';
import { ConfiguracionCategoriasPage } from '../pages/configuracion-categorias/configuracion-categorias';
import { UsuariosAddSubmenuPage } from '../pages/usuarios-add-submenu/usuarios-add-submenu';
import { ProductosPromocionesPage } from '../pages/productos-promociones/productos-promociones';
import { ProductosPromocionesAddPage } from '../pages/productos-promociones-add/productos-promociones-add';
import { ProductosPromocionesModalproductosPage } from '../pages/productos-promociones-modalproductos/productos-promociones-modalproductos';
import { PreconfiguracionPage } from '../pages/preconfiguracion/preconfiguracion';
import { AjusteInventarioPage } from '../pages/ajuste-inventario/ajuste-inventario'
import { ReporteInventarioPage } from '../pages/reporte-inventario/reporte-inventario';
import { CuentasDetalleProductosPage } from '../pages/cuentas-detalle-productos/cuentas-detalle-productos';
import { ProductosCategoriaSubPage } from '../pages/productos-categoria-sub/productos-categoria-sub';
import { CajaEspecialPage } from '../pages/caja-especial/caja-especial';
import { CuentasDetalleSubcategoriaPage } from '../pages/cuentas-detalle-subcategoria/cuentas-detalle-subcategoria';
import { CuentaDetalleConfigMorePage } from '../pages/cuenta-detalle-config-more/cuenta-detalle-config-more';
import { UsuariosActivosPage } from '../pages/usuarios-activos/usuarios-activos';
import { EstadisticasMenuPage } from '../pages/estadisticas-menu/estadisticas-menu';
import { ProductoMasvendidoPage } from '../pages/producto-masvendido/producto-masvendido';
import { InicioAtiendelosrestaurantPage } from '../pages/inicio-atiendelosrestaurant/inicio-atiendelosrestaurant';
import { CajaCorteInicioPage } from '../pages/caja-corte-inicio/caja-corte-inicio';
import { GenerarLlavePage } from '../pages/generar-llave/generar-llave';
import { ConfiguracionWifiPage } from '../pages/configuracion-wifi/configuracion-wifi';
import { GeneradorQrPage } from '../pages/generador-qr/generador-qr';
import { EmpresasPage } from '../pages/empresas/empresas';
import { EmpresasAddPage } from '../pages/empresas-add/empresas-add';
import { InventariosInicioPage } from '../pages/inventarios-inicio/inventarios-inicio';
import { BilletesPage } from '../pages/billetes/billetes';
import { AltaProveedorPage } from '../pages/alta-proveedor/alta-proveedor';
import { ProveedorAdministradorPage } from '../pages/proveedor-administrador/proveedor-administrador';
import { AdminBodegasPage } from '../pages/admin-bodegas/admin-bodegas';
import { OrdenCompraPage } from '../pages/orden-compra/orden-compra';
import { BodegasPage } from '../pages/bodegas/bodegas';
import { MedidasInventarioPage } from '../pages/medidas-inventario/medidas-inventario';
import { MedidasAddPage } from '../pages/medidas-add/medidas-add';
import { OrdenesConsultaPage } from '../pages/ordenes-consulta/ordenes-consulta';
import { OrdenDetallePage } from '../pages/orden-detalle/orden-detalle';
import { VentaseparadaPage } from '../pages/ventaseparada/ventaseparada';
import { VentaseparadaScannerPage } from '../pages/ventaseparada-scanner/ventaseparada-scanner';
import { CorteInventarioPage } from '../pages/corte-inventario/corte-inventario';
import { ControlMovimientoCortePage } from '../pages/control-movimiento-corte/control-movimiento-corte';
import { ControlMovimientoFinalizadoPage } from '../pages/control-movimiento-finalizado/control-movimiento-finalizado';
import { AyudaPage } from '../pages/ayuda/ayuda';
import { PaypalPage } from '../pages/paypal/paypal';
import { AuditoriaDesglosePage } from '../pages/auditoria-desglose/auditoria-desglose';
import { CuentasResumenPagarPage } from '../pages/cuentas-resumen-pagar/cuentas-resumen-pagar';
import { StripePage } from '../pages/stripe/stripe';
import {MapsmakerPage} from '../pages/mapsmaker/mapsmaker';
import { ProductosProductosAddSubmenuPage } from '../pages/productos-productos-add-submenu/productos-productos-add-submenu';
import { ProductosProductosAddSubmenuAddPage } from '../pages/productos-productos-add-submenu-add/productos-productos-add-submenu-add';
import { CuentasVisualizacionPage } from '../pages/cuentas-visualizacion/cuentas-visualizacion';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { SucursalesProvider } from '../providers/sucursales/sucursales';
import { CategoriasProvider } from '../providers/categorias/categorias';
import { GlobalesProvider } from '../providers/globales/globales';
import { MesasProvider } from '../providers/mesas/mesas';
import { ProductosProvider } from '../providers/productos/productos';
import { RolesProvider } from '../providers/roles/roles';
import { ApiyoutubeProvider } from '../providers/apiyoutube/apiyoutube';
import { TicketsProvider } from '../providers/tickets/tickets';
import { InventarioProvider } from '../providers/inventario/inventario';
import { ReportesProvider } from '../providers/reportes/reportes';
import { ImpresionesProvider } from '../providers/impresiones/impresiones';
import { CortecajaProvider } from '../providers/cortecaja/cortecaja';
import { ConfiguracionMeseroProvider } from '../providers/configuracion-mesero/configuracion-mesero';
import { PromocionesProvider } from '../providers/promociones/promociones';
import { EmpresasProvider } from '../providers/empresas/empresas';
import { MenuDesplegableProvider } from '../providers/menu-desplegable/menu-desplegable';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';



@NgModule({
  declarations: [
    MyApp,
    BarPage,
    EstadisticaMeseroPage,
    CocinaPage,
    MenuPage,
    TabsPage,
    LoginPage,
    TransaccionesdiaPage,
    CuentasPage,
    UsuariosPage,
    UsuariosAddPage,
    MesasPage,
    SucursalesPage,
    ProductosPage,
    SucursalesAddPage,
    RolesPage,
    RolesAddPage,
    MenuSubPage,
    MenuSubOrdenPage,
    CuentasDetallePage,
    CuentasTotalPage,
    CuentasResumenPage,
    TicketsPage,
    ProductosCategoriaPage,
    ProductosProductosPage,
    ProductosCategoriaAddPage,
    ProductosProductosAddPage,
    ProductosProductosListayoutubePage,
    InventariosPage,
    InventariosAddPage,
    HistorialPage,
    ConfiguracionPage,
    ConfiguracionEnlaceProductoinventarioPage,
    ConfiguracionEnlaceProductoinventarioAddPage,
    ConfiguracionEnlaceDetalleinventarioPage,
    CajaPage,
    CajaCortePage,
    CajaMesaPage,
    CuentasMesasPage,
    CuentaDetalleConfigPage,
    BluetoothPage,
    BluetoothDispositivosPage,
    ReportesMenuPage,
    ReportesVentaPage,
    ReportesVentaFechaPage,
    MesasAddPage,
    CuentasDetalleAntesdeenviarPage,
    GestionUsuariosPage,
    ConfiguracionCategoriasPage,
    UsuariosAddSubmenuPage,
    ProductosPromocionesPage,
    ProductosPromocionesAddPage,
    ProductosPromocionesModalproductosPage,
    PreconfiguracionPage,
    AjusteInventarioPage,
    AgregaMobimientoPage,
    ControlMovimientoPage,
    ReporteInventarioPage,
    CuentasDetalleProductosPage,
    ProductosCategoriaSubPage,
    CajaEspecialPage,
    CuentasDetalleSubcategoriaPage,
    CuentaDetalleConfigMorePage,
    UsuariosActivosPage,
    EstadisticasMenuPage,
    ProductoMasvendidoPage,
    InicioAtiendelosrestaurantPage,
    EstadisticaVentaxmesPage,
    CajaCorteInicioPage,
    GenerarLlavePage,
    ConfiguracionWifiPage,
    GeneradorQrPage,
    EmpresasPage,
    EmpresasAddPage,
    InventariosInicioPage,
    BilletesPage,
    AltaProveedorPage,
    ProveedorAdministradorPage,
    AdminBodegasPage,
    OrdenCompraPage,
    BodegasPage,
    MedidasInventarioPage,
    MedidasAddPage,
    OrdenesConsultaPage,
    OrdenDetallePage,
    CorteInventarioPage,
    VentaseparadaPage,
    VentaseparadaScannerPage,
    ControlMovimientoCortePage,
    ControlMovimientoFinalizadoPage,
    AyudaPage,
    PaypalPage,
    AuditoriaDesglosePage,
    CuentasResumenPagarPage,
    StripePage,
    MapsmakerPage,
    ProductosProductosAddSubmenuPage,
    ProductosProductosAddSubmenuAddPage,
    CuentasVisualizacionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BarPage,
    EstadisticaMeseroPage,
    CocinaPage,
    MenuPage,
    TabsPage,
    LoginPage,
    TransaccionesdiaPage,
    CuentasPage,
    UsuariosPage,
    UsuariosAddPage,
    MesasPage,
    SucursalesPage,
    ProductosPage,
    SucursalesAddPage,
    RolesPage,
    RolesAddPage,
    MenuSubPage,
    MenuSubOrdenPage,
    CuentasDetallePage,
    CuentasTotalPage,
    CuentasResumenPage,
    TicketsPage,
    ProductosCategoriaPage,
    ProductosProductosPage,
    ProductosCategoriaAddPage,
    ProductosProductosAddPage,
    ProductosProductosListayoutubePage,
    InventariosPage,
    InventariosAddPage,
    HistorialPage,
    ConfiguracionPage,
    ConfiguracionEnlaceProductoinventarioPage,
    ConfiguracionEnlaceProductoinventarioAddPage,
    ConfiguracionEnlaceDetalleinventarioPage,
    CajaPage,
    CajaCortePage,
    CajaMesaPage,
    CuentasMesasPage,
    CuentaDetalleConfigPage,
    BluetoothPage,
    BluetoothDispositivosPage,
    ReportesMenuPage,
    ReportesVentaPage,
    ReportesVentaFechaPage,
    MesasAddPage,
    CuentasDetalleAntesdeenviarPage,
    GestionUsuariosPage,
    ConfiguracionCategoriasPage,
    UsuariosAddSubmenuPage,
    ProductosPromocionesPage,
    ProductosPromocionesAddPage,
    ProductosPromocionesModalproductosPage,
    PreconfiguracionPage,
    AjusteInventarioPage,
    AgregaMobimientoPage,
    ControlMovimientoPage,
    ReporteInventarioPage,
    CuentasDetalleProductosPage,
    ProductosCategoriaSubPage,
    CajaEspecialPage,
    CuentasDetalleSubcategoriaPage,
    CuentaDetalleConfigMorePage,
    UsuariosActivosPage,
    EstadisticasMenuPage,
    ProductoMasvendidoPage,
    InicioAtiendelosrestaurantPage,
    EstadisticaVentaxmesPage,
    CajaCorteInicioPage,
    GenerarLlavePage,
    ConfiguracionWifiPage,
    GeneradorQrPage,
    EmpresasPage,
    EmpresasAddPage,
    InventariosInicioPage,
    BilletesPage,
    AltaProveedorPage,
    ProveedorAdministradorPage,
    AdminBodegasPage,
    OrdenCompraPage,
    BodegasPage,
    MedidasInventarioPage,
    MedidasAddPage,
    OrdenesConsultaPage,
    OrdenDetallePage,
    CorteInventarioPage,
    VentaseparadaPage,
    VentaseparadaScannerPage,
    ControlMovimientoCortePage,
    ControlMovimientoFinalizadoPage,
    AyudaPage,
    PaypalPage,
    AuditoriaDesglosePage,
    CuentasResumenPagarPage,
    StripePage,
    MapsmakerPage,

    ProductosProductosAddSubmenuPage,
    ProductosProductosAddSubmenuAddPage,
    CuentasVisualizacionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AndroidPermissions,
    UsuariosProvider,
    SucursalesProvider,
    CategoriasProvider,
    GlobalesProvider,
    MesasProvider,
    UsuariosProvider,
    ProductosProvider,
    RolesProvider,
    RolesProvider,
    ProductosProvider,
    ApiyoutubeProvider,
    YoutubeVideoPlayer,
    TicketsProvider,
    Vibration,
    SMS,
    CurrencyPipe,
    GooglePlus,
    InventarioProvider,
    ReportesProvider,
    DocumentViewer,
    File,
    FileTransfer,
    ImagePicker,
    Camera,
    BluetoothSerial,
    ImpresionesProvider,
    CortecajaProvider,
    ConfiguracionMeseroProvider,
    LocalNotifications,
    PromocionesProvider,
    InAppBrowser,
    EmpresasProvider,
    DatePipe,
    BarcodeScanner,
    PayPal,
    Geolocation,
    NativeGeocoder,
    MenuDesplegableProvider,
    ConfiguracionProvider
  ]
})
export class AppModule { }
