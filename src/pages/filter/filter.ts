import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';



@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})

export class FilterPage {

    myDate:any;
    constructor(public navCtrl: NavController, public navParams: NavParams) {

        this.myDate = "2017-11-12T18:17:02Z";
    }

}