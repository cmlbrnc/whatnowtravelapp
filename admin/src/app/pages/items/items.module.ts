import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';

import { ItemsComponent } from './items.component';
import { SmartTableComponent } from './smart-table/smart-table.component';


@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ItemsComponent,
  SmartTableComponent
  
  ],
})
export class ItemsModule { }
