import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss'],
})
export class CardapioComponent implements OnInit {

  activedView = 'entrada';
  listaItens = [];
  constructor(public modalController: ModalController, public loadingController: LoadingController) {
    console.log(this);
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
    const firebase = require("firebase");
    require("firebase/firestore");
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyB3nffUHpv_4_7ged3sWNZsZQf-81owOjw",
        authDomain: "iself2.firebaseapp.com",
        databaseURL: "https://iself2.firebaseio.com",
        projectId: "iself2",
        storageBucket: "",
        messagingSenderId: "578892561584",
        appId: "1:578892561584:web:aa1e1d30596a36a23c4f75"
      });
    } 
    var list = new Array;
    var db = firebase.firestore();
    const a = await this.loadingController.create({
    });
    await a.present();
    db.collection("itens").where("tipo", "==", tipo)
    .get()
    .then(function(querySnapshot) {
      console.log(this);
        querySnapshot.forEach(function(doc) {
          list.push(doc.data());
          console.log(doc.id, " => ", doc.data());
        });
        a.dismiss();
    }) 
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.listaItens = list;
    console.log(this.listaItens); 
  } 

  ngOnInit() {
    this.returnDishes('E');
  }

  toggleView(event) {
    this.activedView = event.detail.value;
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
