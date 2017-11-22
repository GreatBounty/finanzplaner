import { Component } from '@angular/core';

import { AusgabePage } from '../ausgabe/ausgabe';
import { ChartsPage } from '../charts/charts';
import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { NavParams } from 'ionic-angular';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ListPage;
  tab3Root = AusgabePage;
  tab4Root = ChartsPage;
  //tab3Root = ContactPage;
  tabsIndex: any;
  constructor(public navparams: NavParams) {
    debugger;
    var test = navparams.get("index");
    this.tabsIndex = test;
  }
}
