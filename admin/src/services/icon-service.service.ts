import { Injectable } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class IconServiceService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  public registerIcons(): void {
    this.loadIcons(Object.values(Icons), '../../../assets/svg');
  }

  private loadIcons(iconKeys: string[], iconUrl: string): void {
    iconKeys.forEach(key => {
      this.matIconRegistry.addSvgIcon(key, this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`));
     // console.log(this.matIconRegistry);
    });
  }
}


export enum Icons {
  cal = 'cal',
  card = 'card',
  group = 'group',
  kitchen='kitchen',
  wifi='wifi',
  airConditioning='air-conditioning',
  freeparking='free-parking-on-premises',
  gpay='gpay',
  paypal = 'paypal',
  banktransfer='bank-transfer',
  creditcard='creditcard',
  mastercard = 'mastercard',
  americanexpress='americanexpress',
  visacard='visacard',
  whatsapp='whatsapp',
  call='call',
  instagram='instagram',
  twitter='twitter',
  facebook='facebook',
  googlemaps='googlemaps',
  search='search',
  Turkish='Turkish',
  English='English',
  germany='germany',
  airbnb='airbnb',
  tripadvisor='tripadvisor',
  booking='booking'
}