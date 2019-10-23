import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MesaService } from '../mesa.service';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss'],
})
export class CardapioComponent implements OnInit {

  activedView = 'E';
  listaItens = [];
  constructor(public modalController: ModalController, 
    public loadingController: LoadingController,
    private service: MesaService) {
    
  }
  
  async presentModal(item) {
    const modal = await this.modalController.create({
      component: ItemDetail,
      componentProps: {
        'descricao': item.descricao,
        'preco': item.preco,
        'quantidade': item.quantidade
      }
    });
    return await modal.present();
  }

  async returnDishes(tipo) {
    const a = await this.loadingController.create({
    });
    await a.present();
    this.service.listar(tipo).subscribe(resp => {
      a.dismiss();
      this.listaItens = resp;
    });
  } 

  ngOnInit() {
    this.toggleView({detail: { value: 'E' }});
  }
  
  toggleView(event) {    
    console.log(event.detail.value);
    this.activedView = event.detail.value;
    this.returnDishes(this.activedView);
  }
}

@Component({
  selector: 'item-detail',
  template: '<h1>Descrição: {{ descricao }} Preço: {{ preco }} Quantidade: {{quantidade}}</h1>',
  styles: ['./cardapio.component.scss'],
})
export class ItemDetail implements OnInit {

  @Input() descricao: string;
  @Input() preco: string;
  @Input() quantidade: string;

  ngOnInit() {}

}
