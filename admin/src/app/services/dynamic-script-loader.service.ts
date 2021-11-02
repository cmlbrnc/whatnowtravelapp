
import { Injectable, Injector } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Subject, Observable, of } from 'rxjs';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'googlePlaces-en', src: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyDEXVDM-xT5zjW0cOyK27KovOA4Ri6jyIE&language=en' },
  { name: 'googlePlaces-tr', src: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyDEXVDM-xT5zjW0cOyK27KovOA4Ri6jyIE&language=tr' },

];

declare var document: any;

@Injectable({
  providedIn: 'root',
})
export class DynamicScriptLoaderService {

  private scripts: any = {};


  constructor(private _constant?: ConstantsService) {
    ScriptStore.forEach((script: any) => {
   
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
   
   


  }


  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({script: name, loaded: true, status: 'Loaded'});
            };
        }
        script.onerror = (error: any) => reject({script: name, loaded: false, status: 'Not Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

   loadGooglePlacesI18n() {
     //  console.log(this._constant.locale);
      
    return new Observable( (observer) => {
    
      // observable execution
      if(this._constant.locale=='tr') { 
    
       
          
          this.load('googlePlaces-tr').then(data => {
            console.log(data);
            observer.next(data)
            observer.complete();
           
          }).catch(error=>error);

         
    
       
      }else {

   
     
          this.load('googlePlaces-en').then(data => {
            console.log(data);
            observer.next(data)
            observer.complete();
          }).catch(error=>error);

         
      
      }
    
  })
 
  
  }

}