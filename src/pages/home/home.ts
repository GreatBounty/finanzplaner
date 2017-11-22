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

  constructor(private afs: AngularFirestore, public navCtrl: NavController, private formBuilder: FormBuilder) {

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

    let dateTimeNow = this.formatDate(new Date());
    this.ausgabeFormGroup.controls.kaufzeitpunkt.setValue(dateTimeNow);
  }
  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    let dateWithoutTime = [year, month, day].join('-');

    let hour = '' + d.getHours(),
      minute = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (seconds.length < 2) seconds = '0' + seconds;

    let dateWithTime = dateWithoutTime + 'T' + hour + ':' + minute + ':' + seconds + 'Z';
    return dateWithTime;
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
    let pThis = this;
    this.categoriesFiltered = [];
    this.ausgabeFormGroup.controls.kategorie.setValue(val);
    //TODO - init data for subCategories
    pThis.subCategories = [];
    this.setSubCategorieListForHtml(val);
    /*
    this.db.list('Kategorien/' + val).forEach(function (values) {
      for (let subCategories of values) {
        pThis.subCategories.push(subCategories.$value);
      }
    });
*/
  }
  setSubCategorieFromHtml(val: any) {
    this.subCategoriesFiltered = [];
    this.ausgabeFormGroup.controls.unterkategorie.setValue(val);
  }

  private setSubCategorieListForHtml(val) {
    let pThis = this;
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
            data.forEach(function (val) {
              pThis.subCategories.push(val.SubKategorieName);
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
    let dateTimeNow = this.formatDate(new Date());
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
    this.ausabe.betrag = this.ausgabeFormGroup.controls.betrag.value;
    this.ausabe.kategorie = this.ausgabeFormGroup.controls.kategorie.value;
    this.ausabe.unterkategorie = this.ausgabeFormGroup.controls.unterkategorie.value;
    this.ausabe.kaufzeitpunkt = this.ausgabeFormGroup.controls.kaufzeitpunkt.value;
    this.ausabe.created = this.formatDate(new Date());
    let buyTime = new Date(this.ausabe.kaufzeitpunkt);
    this.ausabe.month = buyTime.getMonth() + 1;
    this.ausabe.year = buyTime.getFullYear();
    this.ausabe.day = buyTime.getDate();
  }
}
