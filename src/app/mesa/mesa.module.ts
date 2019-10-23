import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardapioComponent, ItemDetail } from './cardapio/cardapio.component';
import { ContaComponent } from './conta/conta.component';

import { IonicModule } from '@ionic/angular';

import { MesaPage } from './mesa.page';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { MesaService } from './mesa.service';

const routes: Routes = [
  {
    path: '',
    component: MesaPage,
    children: [
      { path: 'cardapio', component: CardapioComponent },
      { path: 'conta', component: ContaComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ItemDetail],
  declarations: [MesaPage, CardapioComponent, ContaComponent, ItemDetail],
  providers: [MesaService]
})
export class MesaPageModule {}
