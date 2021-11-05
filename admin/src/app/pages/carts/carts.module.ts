
import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbPopoverModule,
  NbWindowModule,
} from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';
import { CartsComponent } from './carts.component';

import { FormsModule } from '@angular/forms';
import { CarditemsComponent } from './carditems/carditems.component';


@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbPopoverModule,
    NbWindowModule.forRoot(),
    
  ],
  declarations: [
    CartsComponent,
    CarditemsComponent
  ],
})
export class CartsModule { }
