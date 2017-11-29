import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../../Kategorien/iKategorien';
import { ListPage } from '../list/list';
import { Helper } from '../../helper/helper';



@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html'
})

export class FilterPage {

    year: any;
    day: any;
    month: any

    chkYear: any;
    chkMonth: any;
    chkDay: any

    kategorienCollectionRef: AngularFirestoreCollection<any>;
    kategorien$: Observable<any[]>;
    private listNameCategorie: string = "Categorie";
    private listNameSubCategorie: string = "SubCategorie";
    categoriesFiltered: any[];
    categories: any[] = [];
    subCategoriesFiltered: any[];
    subCategories: any[] = [];

    Unterkategorie: any;
    Kategorie: any;


    constructor(public afs: AngularFirestore, public helper: Helper, public navCtrl: NavController, public navParams: NavParams) {
        let today = new Date().toISOString();
        this.year = today;
        this.month = today;
        this.day = today;

        this.kategorienCollectionRef = this.afs.collection<any>('Kategorien');
        this.kategorien$ = this.kategorienCollectionRef.valueChanges();
    }
    initialize(listName: string) {
        if (listName === this.listNameCategorie) {
            this.categoriesFiltered = this.categories;
        }
        else if (listName === this.listNameSubCategorie) {
            this.subCategoriesFiltered = this.subCategories;
        }
    }

    executeFilter() {
        debugger;
        let yearVal = new Date(this.year).getFullYear();
        let monthVal = (new Date(this.month).getMonth()) + 1;
        let dayVal = new Date(this.day).getDate();
        let valObj = { year: 0, month: 0, day: 0, category: "", subCategory: "" };
        if (this.chkYear) {
            valObj.year = yearVal;
        }
        if (this.chkMonth) {
            valObj.month = monthVal;
        }
        if (this.chkDay) {
            valObj.day = dayVal;
        }
        if (this.Kategorie !== undefined) {
            valObj.category = this.Kategorie;
        }
        if (this.Unterkategorie !== undefined) {
            valObj.subCategory = this.Unterkategorie;
        }
        this.navCtrl.push(ListPage, valObj);
    }
    clearFilter() {
        this.Kategorie = "";
    }
    setSubCategorieFromHtml(val: any) {
        this.subCategoriesFiltered = [];
        this.Unterkategorie = val;
    }
    setCategorieFromHtml(val: any) {
        this.categoriesFiltered = [];
        //this.ausgabeFormGroup.controls.kategorie.setValue(val);
        this.Kategorie = val;
        this.Unterkategorie = "";
        this.subCategories = [];
        this.setSubCategorieListForHtml(val);
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

}