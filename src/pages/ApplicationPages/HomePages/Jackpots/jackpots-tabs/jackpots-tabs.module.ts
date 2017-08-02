import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JackpotsTabsPage } from './jackpots-tabs';

@NgModule({
  declarations: [
    JackpotsTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(JackpotsTabsPage),
  ],
  exports: [
    JackpotsTabsPage
  ]
})
export class JackpotsTabsPageModule {}
