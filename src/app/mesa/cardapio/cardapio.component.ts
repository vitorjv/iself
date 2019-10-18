import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonList } from '@ionic/angular';
import { ContaComponent } from '../conta/conta.component';
import {firebaseConfig} from '../../../environments/environment';
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
        'firstName': 'Davi',
        'lastName': 'Adams',
        'middleInitial': 'N'
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
    db.collection("itens").where("tipo", "==", tipo)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  ngOnInit() {}

  toggleView(event) {
    this.activedView = event.detail.value;
  }
}

@Component({
  selector: 'item-detail',
  template: '<h1>{{ firstName }} {{ lastName }}</h1>',
  styles: ['./cardapio.component.scss'],
})
export class ItemDetail implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

  ngOnInit() {}

}