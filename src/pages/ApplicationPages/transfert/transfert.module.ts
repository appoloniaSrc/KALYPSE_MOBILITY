import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransfertPage } from './transfert';

@NgModule({
  declarations: [
    TransfertPage,
  ],
  imports: [
    IonicPageModule.forChild(TransfertPage),
  ],
  exports: [
    TransfertPage
  ]
})
export class TransfertPageModule {}
