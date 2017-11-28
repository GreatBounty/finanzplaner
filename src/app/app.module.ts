import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AusgabePage } from '../pages/ausgabe/ausgabe';
import { ChartsPage } from '../pages/charts/charts';
import { TabsPage } from '../pages/tabs/tabs';
import { FilterPage } from '../pages/filter/filter';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//helper
import { environment } from '../environment/environment';
import { Helper } from '../helper/helper';
//Database Connectors
import { DbAusgaben } from '../database/db_ausgaben';

// Import the AF2 Module
//import { AngularFireModule } from 'angularfire2';
//import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AusgabePage,
    ChartsPage,
    TabsPage,
    FilterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AusgabePage,
    ChartsPage,
    TabsPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Helper,
    DbAusgaben,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
