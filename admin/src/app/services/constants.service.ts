import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { DynamicScriptLoaderService } from './dynamic-script-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  
   locale:string;

   url;
   readonly mainPicLocation='/assets/images/552A1921-min.jpg'
   readonly logoUrlLocation='/assets/images/birinciVillam.png'
   mainPic;
   appLogoUrl;
  
  constructor(@Inject(LOCALE_ID) private _locale:string ,platformLocation:PlatformLocation) {
       
      this.locale=this._locale;
      this.mainPic= (platformLocation as any).location.origin + this.mainPicLocation;
      this.appLogoUrl= (platformLocation as any).location.origin + this.logoUrlLocation;

   }
}
