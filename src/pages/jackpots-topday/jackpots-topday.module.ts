import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JackpotsTopdayPage } from './jackpots-topday';

@NgModule({
  declarations: [
    JackpotsTopdayPage,
  ],
  imports: [
    IonicPageModule.forChild(JackpotsTopdayPage),
  ],
  exports: [
    JackpotsTopdayPage
  ]
})
export class JackpotsTopdayPageModule {}
