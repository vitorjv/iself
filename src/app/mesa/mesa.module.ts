import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardapioComponent, ItemDetail, ConfirmacaoPedido } from './cardapio/cardapio.component';
import { ContaComponent } from './conta/conta.component';

import { IonicModule } from '@ionic/angular';

import { MesaPage } from './mesa.page';
import { MesaService } from './mesa.service';

const routes: Routes = [
  {
    path: ':conta',
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
  entryComponents: [ItemDetail, ConfirmacaoPedido],
  declarations: [MesaPage, CardapioComponent, ContaComponent, ItemDetail, ConfirmacaoPedido],
  providers: [MesaService]
})
export class MesaPageModule {}
