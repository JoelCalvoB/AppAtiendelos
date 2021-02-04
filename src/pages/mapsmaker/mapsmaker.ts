import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';



/**
 * Generated class for the MapsmakerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 * 
 */

 var map= null;
 var marker= {setMap:function(event){}, addListener:null , setIcon:null};
 var bandera= true;
 var  clicklat;
 var clicklong;


function addMarker(props){
  marker.setMap(null);

 marker = new google.maps.Marker({
  position:{lat:props.coords.lat(),lng:props.coords.lng()},
  map:map
  //icon:props.iconImage
});




if (bandera==false)
{
  clicklat=props.coords.lat();
 clicklong=props.coords.lng();
}

if (bandera==true)
{
  bandera=false;

}






// Check for customicon
if(props.iconImage){
  // Set icon image
  marker.setIcon(props.iconImage);
}

// Check content
if(props.content){
  var infoWindow = new google.maps.InfoWindow({
    content:props.content
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}
}







interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}



 declare var google;

@Component({
  selector: 'page-mapsmaker',
  templateUrl: 'mapsmaker.html',
})
export class MapsmakerPage {

 public  latitude:number;
  public 	longitude:number ;
  public lat:number;
  public lng:number
  public direccion:string;



  geoAccuracy:number;
  geoAddress: string;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    public geolocation: Geolocation , 
   private alerta: AlertController,
   private nativeGeocoder: NativeGeocoder
  ) {

   
}


  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then(position =>{
        this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
   
this.loadMap(this.latitude,this.longitude);

      },error=>{
          
      });


  }

  loadMap(n1:number , n2:number) {    
    const mapEle: HTMLElement = document.getElementById('map');
    const myLatLng = {lat: n1, lng: n2};

    map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 16
    });

    google.maps.event.addListener(map, 'click', (event)=>{
      
      addMarker({coords:event.latLng});

      let marcador = {coords:
        {
        lat:function(){return n1}, lng:function(){return n2}
        }
        
      }
      this.getGeoencoder(clicklat,clicklong);
    }
  
  );

  
    google.maps.event.addListenerOnce(map, 'idle', () => {
let marcador = {coords:
{
lat:function(){return n1}, lng:function(){return n2}
}}
      addMarker(marcador);
     
      this.getGeoencoder(n1,n2);


    });


  }



  TuUbicacion(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: map,
      content: '<h1>Tú</h1>'
    }); 
  }



  getGeoencoder(latpar,longpar){
    alert('Obteniendo Dirección');
    this.nativeGeocoder.reverseGeocode(latpar, longpar, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);

    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  generateAddress(addressObj){
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      address += obj[val]+', ';
    }
  return address.slice(0, -2);
}


   



 }
