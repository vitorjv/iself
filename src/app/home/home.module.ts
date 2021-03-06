import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: HomePage }
    ])
  ],
  declarations: [HomePage],
  providers: [QRScanner]
})
export class HomePageModule {}
