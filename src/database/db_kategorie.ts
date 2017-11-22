import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../Ausgaben/iAusgaben';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../Kategorien/iKategorien';
import { Helper } from '../helper/helper';


@Injectable()
export class DbKategorie {


    oKategorie: IKategorie = {
        KategorieName: ""
    }
    oSubKategorie: ISubKategorie = {
        Kategorie: null,
        SubKategorieName: ""
    }
    kategorienCollectionRef: AngularFirestoreCollection<any>;
    kategorien$: Observable<any[]>;

    finanz: any;
    //categorieList: any;
    private listNameCategorie: string = "Categorie";
    private listNameSubCategorie: string = "SubCategorie";

    constructor(private helper: Helper, private afs: AngularFirestore, public navCtrl: NavController, private formBuilder: FormBuilder) {

        this.kategorienCollectionRef = this.afs.collection<any>('Kategorien');
        this.kategorien$ = this.kategorienCollectionRef.valueChanges();
    }
    getKategorieList(path?: string) {
        if(path !== null && path !== "" && path !== undefined){
            return this.afs.collection<any>('Kategorien/' + path)
        }
        return this.kategorienCollectionRef;

    }
}