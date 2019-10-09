import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContaComponent } from '../conta/conta.component';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss'],
})
export class CardapioComponent implements OnInit {

  activedView = 'entrada';

  constructor(public modalController: ModalController) {

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ItemDetail,
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();
  }

  ngOnInit() {}

  toggleView(event) {
    this.activedView = event.detail.value;
  }

}

@Component({
  selector: 'item-detail',
  template: '<h1>{{ firstName }}</h1>',
  styles: ['./cardapio.component.scss'],
})
export class ItemDetail implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

  ngOnInit() {}

}