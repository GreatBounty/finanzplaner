import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../Ausgaben/iAusgaben';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../Kategorien/iKategorien';
import { Helper } from '../helper/helper';


@Injectable()
export class DbAusgaben {

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
    categoriesFiltered: any[];
    categories: any[] = [];
    subCategoriesFiltered: any[];
    subCategories: any[] = [];

    constructor(private helper: Helper, private afs: AngularFirestore) {
        this.ausgabenCollectionRef = this.afs.collection<IAusgabe>('Ausgaben');
        this.ausgaben$ = this.ausgabenCollectionRef.valueChanges();

        this.kategorienCollectionRef = this.afs.collection<any>('Kategorien');
        this.kategorien$ = this.kategorienCollectionRef.valueChanges();
    }
    
    getAusgabenCollection(path?: string) {
        if (path !== null && path !== "" && path !== undefined) {
            return this.afs.collection<IAusgabe>('Ausgaben/' + path)
        }
        return this.afs.collection<IAusgabe>('Ausgaben');
    }

    getAusgabenSortedCollection(path?: string) {

        if (path !== null && path !== "" && path !== undefined) {
            return this.afs.collection<IAusgabe>('Ausgaben/' + path, ref => ref.orderBy("year", "desc").orderBy("month", "desc").orderBy("day", "desc"));
        }
        return this.afs.collection<IAusgabe>('Ausgaben', ref => ref.orderBy("year", "desc").orderBy("month", "desc").orderBy("day", "desc"));
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
    //ionViewWillEnter() {
    getCategoriesWithIdAsArray() {
        let categories: any[] = [];
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
                data.forEach(function (val) {
                    let a = val.KategorieName;
                    categories.push(a);
                })
                return categories;
            }
        });
    }

    addAusgabe(ausgabe: IAusgabe) {
        this.ausgabenCollectionRef.add(this.ausabe);
        //or add({betrag: 3, datum: '', ...}
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
}
