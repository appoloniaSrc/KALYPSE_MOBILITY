import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JackpotsMachinePage } from './jackpots-machine';

@NgModule({
  declarations: [
    JackpotsMachinePage,
  ],
  imports: [
    IonicPageModule.forChild(JackpotsMachinePage),
  ],
  exports: [
    JackpotsMachinePage
  ]
})
export class JackpotsMachinePageModule {}
