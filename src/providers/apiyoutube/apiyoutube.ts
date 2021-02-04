import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';

/*
  Generated class for the ApiyoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiyoutubeProvider {

  private id_canal = "UCJFp8uSYCjXOMnkUyb3CQ3Q";
private apiKey = "AIzaSyBIwHUDTKsz-XZab4LA-yjuGgxBQN9jVx0";
private direccion = "";

  constructor(public http: HttpClient){
    
  }

  public obtenerVideos():Observable<any>{
      this.direccion = "https://www.googleapis.com/youtube/v3/search?key="+this.apiKey+"&channelId="+this.id_canal+"&part=snippet,id&order=date&maxResults=20";
      
      return this.http.get(this.direccion);
  }

  public onInput(obj){
    
  }

  public onCancel(obj){
    
  }
}
