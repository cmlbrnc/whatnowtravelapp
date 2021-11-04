import { ItemsModule } from './items/items.module';
import { CartsModule } from './carts/carts.module';

import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    CartsModule,
    ItemsModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
