
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { IAusgabe } from '../Ausgaben/iAusgaben';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { IKategorie, ISubKategorie } from '../Kategorien/iKategorien';


@Injectable()
export class Helper {




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
}