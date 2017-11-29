import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../../Ausgaben/iAusgaben';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../../Kategorien/iKategorien';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

@Injectable()
export class HomePage {

  ausabe: IAusgabe = {
    betrag: 0,
    kategorie: "",
    unterkategorie: "",
    created: null,
    kaufzeitpunkt: null,
    day: null,
    month: null,
    year: null
  }

  oKategorie: IKategorie = {
    KategorieName: ""
  }
  oSubKategorie: ISubKategorie = {
    Kategorie: null,
    SubKategorieName: ""
  }

  ausgabenCollectionRef: AngularFirestoreCollection<IAusgabe>;
  ausgaben$: Observable<IAusgabe[]>;

  kategorienCollectionRef: AngularFirestoreCollection<any>;
  kategorien$: Observable<any[]>;

  finanz: any;
  //categorieList: any;
  private listNameCategorie: string = "Categorie";
  private listNameSubCategorie: string = "SubCategorie";
  private ausgabeFormGroup: FormGroup;
  categoriesFiltered: any[];
  categories: any[] = [];
  subCategoriesFiltered: any[];
  subCategories: any[] = [];



  monatsBudget: number;
  monatsAusgaben: number;
  diffBudgetAusgaben: number;
  budgetColor: string;
  constructor(private afs: AngularFirestore, public navCtrl: NavController, private formBuilder: FormBuilder) {

    this.ausgabenCollectionRef = this.afs.collection<IAusgabe>('Ausgaben');
    this.ausgaben$ = this.ausgabenCollectionRef.valueChanges();

    this.kategorienCollectionRef = this.afs.collection<any>('Kategorien');
    this.kategorien$ = this.kategorienCollectionRef.valueChanges();

    this.monatsBudget = 450;
    this.monatsAusgaben = 400;
    this.budgetColor = "budgetColor_black";
    this.calculateDiff();

  }

  calculateDiff() {
    this.diffBudgetAusgaben = this.monatsBudget - this.monatsAusgaben;
    if (this.diffBudgetAusgaben < (this.monatsBudget * 0.35)) {
      this.budgetColor = "budgetColor_orange";
    } else {
      this.budgetColor = "budgetColor_black";
    }
    if (this.diffBudgetAusgaben < (this.monatsBudget * 0.2)) {
      this.budgetColor = "budgetColor_red";
    }

  }
  ionViewWillEnter() {
    console.log(this.monatsBudget);

    //this.diffBudgetAusgaben = this.monatsBudget - this.monatsAusgaben;
  }
}
