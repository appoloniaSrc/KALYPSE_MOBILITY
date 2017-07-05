import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JackpotsPage } from './jackpots';

@NgModule({
  declarations: [
    JackpotsPage,
  ],
  imports: [
    IonicPageModule.forChild(JackpotsPage),
  ],
  exports: [
    JackpotsPage
  ]
})
export class JackpotsPageModule {}
