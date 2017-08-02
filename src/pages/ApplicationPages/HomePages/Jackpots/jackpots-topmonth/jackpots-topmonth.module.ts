import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JackpotsTopmonthPage } from './jackpots-topmonth';

@NgModule({
  declarations: [
    JackpotsTopmonthPage,
  ],
  imports: [
    IonicPageModule.forChild(JackpotsTopmonthPage),
  ],
  exports: [
    JackpotsTopmonthPage
  ]
})
export class JackpotsTopmonthPageModule {}
