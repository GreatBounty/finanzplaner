import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../../Ausgaben/iAusgaben';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { StatusBar } from '@ionic-native/status-bar';
import { DbAusgaben } from '../../database/db_ausgaben';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  // ausgaben: FirebaseListObservable<any>;
  alleAusgaben: number;
  betrag: number = 0;
  monat: string;
  ausgabenCollection: AngularFirestoreCollection<IAusgabe>;
  todo$: Observable<IAusgabe[]>;

  constructor(public dbAusgaben: DbAusgaben, public statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    this.statusBar.styleDefault();

    this.ausgabenCollection = this.dbAusgaben.getAusgabenSortedCollection();
    this.todo$ = this.ausgabenCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IAusgabe;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    });
    this.calculateCost(this.ausgabenCollection);

  }

  testOnchange() {

    if (this.monat !== undefined && this.monat !== "") {
      if (this.monat === "0") {
        this.ausgabenCollection = this.afs.collection<IAusgabe>('Ausgaben', ref => ref.orderBy("month", "asc").orderBy("day", "desc"));
      } else {
        this.ausgabenCollection = this.afs.collection<IAusgabe>('Ausgaben', ref => ref.where('month', '==', Number(this.monat)).orderBy("day", "desc"));
      }
    }
    this.todo$ = this.ausgabenCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IAusgabe;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
    this.calculateCost(this.ausgabenCollection);
  }



  test(event, item) {

    debugger;
    let test = item.id;
    console.log(item);
  }
  calculateCost(collection: AngularFirestoreCollection<any>) {
    let pThis = this;
    let betrag = 0;
    let values = collection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IAusgabe;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
    values.subscribe(data => {
      if (data.length > 0) {
        data.forEach(val => {
          betrag += Number(val.betrag);
        })
      }
      this.alleAusgaben = betrag;
    });
  }
}
