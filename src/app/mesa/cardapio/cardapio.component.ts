import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { MesaService } from '../mesa.service';
import { Pedido, Item, Restaurante } from '../../model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss'],
})
export class CardapioComponent implements OnInit {

  activedView = 'E';
  listaItens = [];
  pedidosAFazer: Pedido[] = [];

  constructor(private route: ActivatedRoute,
    public modalController: ModalController,
    public loadingController: LoadingController,
    private service: MesaService,
    public toastController: ToastController) { }

  ngOnInit() {
    this.carregarPedidos();
    this.toggleView({ detail: { value: 'E' } });
  }

  recuperarUsuario() {
    return null;
  }

  async exibirDetalheDoItem(item) {
    const modal = await this.modalController.create({
      component: ItemDetail,
      componentProps: {
        'item': item,
        'quantidade': this.quantidade(item)
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.pedidosAFazer.find(i => i.item.descricao === item.descricao).quantidade = data.quantidade;
    }
  }

  async confirmarPedidos() {
    const modal = await this.modalController.create({
      component: ConfirmacaoPedido,
      componentProps: {
        'pedidosAFazer': this.pedidosAFazer.filter(pedido => pedido.quantidade > 0)
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.confirm) {
      this.efetuarPedido(data.pedidos);
    }
  }

  async returnDishes(tipo) {
    const a = await this.loadingController.create({
    });
    await a.present();
    this.service.listarItens(tipo).subscribe(resp => {
      a.dismiss();
      this.listaItens = resp;
    });
  }

  get nomeRestaurante() {
    if (this.service && this.service.restaurante)
      return this.service.restaurante.nome;

    return 'Carregando ...'
  }

  carregarPedidos() {
    this.service.listarItens().subscribe(
      resp => {
        resp.forEach(item => {
          const pedido = new Pedido();
          pedido.item = item;
          pedido.quantidade = 0;
          this.pedidosAFazer.push(pedido);
        });
      }
    );
  }

  diminuir(item: Item) {
    if (this.quantidade(item) > 0)
      this.pedidosAFazer.find(i => i.item.descricao === item.descricao).quantidade--;
  }

  aumentar(item: Item) {
    if (this.quantidade(item) < 9)
      this.pedidosAFazer.find(i => i.item.descricao === item.descricao).quantidade++;
  }

  quantidade(item: Item): number {
    return this.pedidosAFazer.find(i => i.item.descricao === item.descricao).quantidade;
  }

  toggleView(event) {
    this.activedView = event.detail.value;
    this.returnDishes(this.activedView);
  }

  efetuarPedido(pedidos: Pedido[]) {
    pedidos.forEach(pedido => {
      pedido.dataHora = new Date();
      pedido.status = 'A';
      this.service.fazerPedido(pedido).then(
        resp => {
          this.pedidosAFazer.find(ped => ped === pedido).quantidade = 0;
          if (!this.pedidosAFazer.some(ped => ped.quantidade > 0)) {
            // this.toggleView({ detail: { value: 'E' } });
            this.exibirToast(`Pedido${pedidos.length > 1 ? 's' : ''} realizado${pedidos.length > 1 ? 's' : ''} com sucesso`);
          }
        }
      );
    });
  }

  async exibirToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  get existePedido() {
    return this.pedidosAFazer.some(p => p.quantidade > 0);
  }

}

@Component({
  selector: 'item-detail',
  templateUrl: './item-detail.html',
  styles: ['./cardapio.component.scss'],
})
export class ItemDetail implements OnInit {
  
  @Input() item: Item;
  @Input() quantidade: number;

  constructor(private modalCtl: ModalController) { }

  ngOnInit() { }

  diminuir() {
    if (this.quantidade > 0)
      this.quantidade--;  
  }

  aumentar() {
    if (this.quantidade < 9)
      this.quantidade++;
  }

  fecharModal() {
    this.modalCtl.dismiss({
      'quantidade': this.quantidade
    });
  }

}

@Component({
  selector: 'confirmacao-pedido',
  templateUrl: './confirma-pedido.html',
  styles: ['./cardapio.component.scss'],
})
export class ConfirmacaoPedido implements OnInit {

  @Input() pedidosAFazer: Pedido[];

  ngOnInit() { }

  constructor(private modalCtl: ModalController) { }

  get totalPedidos(): number {
    return this.pedidosAFazer.reduce((a, b) => a + (b.quantidade * b.item.preco || 0), 0);
  }

  confirmarPedido() {
    this.modalCtl.dismiss({
      'confirm': true,
      'pedidos': this.pedidosAFazer
    });
  }

  fecharModal() {
    this.modalCtl.dismiss({
      'confirm': false
    });
  }
}