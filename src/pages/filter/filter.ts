import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

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
    constructor(public helper: Helper, public navCtrl: NavController, public navParams: NavParams) {
        let today = new Date().toISOString();
        this.year = today;
        this.month = today;
        this.day = today;

    }

    executeFilter() {
        debugger;
        let yearVal = new Date(this.year).getFullYear();
        let monthVal = (new Date(this.month).getMonth()) + 1;
        let dayVal = new Date(this.day).getDate();
        let valObj = { year: 0, month: 0, day: 0 };

        if (this.chkYear) {
            valObj.year = yearVal;
        }
        if (this.chkMonth) {
            valObj.month = monthVal;
        }
        if (this.chkDay) {
            valObj.day = dayVal;
        }
        this.navCtrl.push(ListPage, valObj);
    }

}