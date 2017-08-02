import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformationsPage } from './informations';

@NgModule({
  declarations: [
    InformationsPage,
  ],
  imports: [
    IonicPageModule.forChild(InformationsPage),
  ],
  exports: [
    InformationsPage
  ]
})
export class InformationsPageModule {}
