import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../../Ausgaben/iAusgaben';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../../Kategorien/iKategorien';
import { Helper } from '../../helper/helper';

@Component({
  selector: 'page-ausgabe',
  templateUrl: 'ausgabe.html'
})

@Injectable()
export class AusgabePage {

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

  constructor(private helper: Helper, private afs: AngularFirestore, public navCtrl: NavController, private formBuilder: FormBuilder) {

    this.ausgabenCollectionRef = this.afs.collection<IAusgabe>('Ausgaben');
    this.ausgaben$ = this.ausgabenCollectionRef.valueChanges();

    this.kategorienCollectionRef = this.afs.collection<any>('Kategorien');
    this.kategorien$ = this.kategorienCollectionRef.valueChanges();


    this.ausgabeFormGroup = this.formBuilder.group({
      betrag: ['0.0', Validators.required],
      kategorie: ['', Validators.required],
      unterkategorie: [''],
      kaufzeitpunkt: ['']
    });

    let dateTimeNow = this.helper.formatDate(new Date());
    this.ausgabeFormGroup.controls.kaufzeitpunkt.setValue(dateTimeNow);
  }

  initialize(listName: string) {
    if (listName === this.listNameCategorie) {
      this.categoriesFiltered = this.categories;
    }
    else if (listName === this.listNameSubCategorie) {
      this.subCategoriesFiltered = this.subCategories;
    }
  }

  setCategorieFromHtml(val: any) {
    this.categoriesFiltered = [];
    this.ausgabeFormGroup.controls.kategorie.setValue(val);
    this.subCategories = [];
    this.setSubCategorieListForHtml(val);
  }
  setSubCategorieFromHtml(val: any) {
    this.subCategoriesFiltered = [];
    this.ausgabeFormGroup.controls.unterkategorie.setValue(val);
  }

  private setSubCategorieListForHtml(val) {
    let filteredCatList = this.afs.collection('Kategorie', ref => ref.where('KategorieName', '==', val));
    let values = filteredCatList.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
    values.subscribe(data => {
      if (data.length > 0) {
        let id = data[0].id;
        const katRef = this.afs.doc('Kategorie/' + id);
        let subCatList = this.afs.collection<any>('SubKategorie');

        let filteredSubCatList = this.afs.collection('SubKategorie', ref => ref.where('Kategorie', '==', katRef.ref));
        let values = filteredSubCatList.snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as ISubKategorie;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        })

        values.subscribe(data => {
          if (data.length != 0) {
            data.forEach(val => {
              this.subCategories.push(val.SubKategorieName);
            })
          }
        });
      }
    });
  }
  ionViewWillEnter() {
    let catList = this.afs.collection<any>('Kategorie');
    let values = catList.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IKategorie;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
    values.subscribe(data => {
      if (data.length > 0) {
        data.forEach(val => {
          let a = val.KategorieName;
          this.categories.push(a);
        })
      }
    });
  }

  selectCategorie(ev: any) {
    // Reset items back to all of the items
    this.initialize(this.listNameCategorie);
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.categoriesFiltered = this.categoriesFiltered.filter((item) => {
        if (item.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          console.log(item);
        }
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  selectSubCategorie(ev: any) {
    // Reset items back to all of the items
    this.initialize(this.listNameSubCategorie);
    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.subCategoriesFiltered = this.subCategoriesFiltered.filter((item) => {
        if (item.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          console.log(item);
        }
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addAusgabe(ausgabe: IAusgabe) {
    this.ausgabenCollectionRef.add(this.ausabe);
    //or add({betrag: 3, datum: '', ...}
  }
  logForm() {

    this.setAusgabeFromForm();
    this.addAusgabe(this.ausabe);
    this.ausgabeFormGroup.reset();
    let dateTimeNow = this.helper.formatDate(new Date());
    this.ausgabeFormGroup.controls.kaufzeitpunkt.setValue(dateTimeNow);
    this.ausgabeFormGroup.controls.betrag.setValue(0);

    this.updateKategorien(this.ausabe.kategorie, this.ausabe.unterkategorie);
  }

  private setKategorie(data, categorie, subcategorie) {
    if (data.length == 0) {
      let catList = this.afs.collection<any>('Kategorie');
      catList.add({ KategorieName: categorie });
    } else {
      this.setSubKategorie(data, categorie, subcategorie);
    }
  }

  private setSubKategorie(data, categorie, subcategorie) {
    let id = data[0].id;
    const katRef = this.afs.doc('Kategorie/' + id);
    let subCatList = this.afs.collection<any>('SubKategorie');

    let filteredSubCatList = this.afs.collection('SubKategorie', ref => ref.where('Kategorie', '==', katRef.ref).where('SubKategorieName', '==', subcategorie));
    let values = filteredSubCatList.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })

    values.subscribe(data => {
      if (data.length == 0) {
        subCatList.add({ SubKategorieName: subcategorie, Kategorie: katRef.ref });
      }
    });
  }

  private updateKategorien(categorie: string, subcategorie: string) {
    let catList = this.afs.collection<any>('Kategorie');
    let filteredCatList = this.afs.collection('Kategorie', ref => ref.where('KategorieName', '==', categorie));
    let values = filteredCatList.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
    values.subscribe(data => {
      this.setKategorie(data, categorie, subcategorie);
    });
  }

  private setAusgabeFromForm() {
    this.ausabe.betrag = Number(this.ausgabeFormGroup.controls.betrag.value);
    this.ausabe.kategorie = this.ausgabeFormGroup.controls.kategorie.value;
    this.ausabe.unterkategorie = this.ausgabeFormGroup.controls.unterkategorie.value;
    this.ausabe.kaufzeitpunkt = this.ausgabeFormGroup.controls.kaufzeitpunkt.value;
    this.ausabe.created = this.helper.formatDate(new Date());
    let buyTime = new Date(this.ausabe.kaufzeitpunkt);
    this.ausabe.month = buyTime.getMonth() + 1;
    this.ausabe.year = buyTime.getFullYear();
    this.ausabe.day = buyTime.getDate();
  }
}
