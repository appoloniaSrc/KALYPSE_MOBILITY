import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarPage } from './bar';

@NgModule({
  declarations: [
    BarPage,
  ],
  imports: [
    IonicPageModule.forChild(BarPage),
  ],
  exports: [
    BarPage
  ]
})
export class BarPageModule {}
