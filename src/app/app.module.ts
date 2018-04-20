import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
// import { RouteReuseStrategy } from '@angular/router';
// import { AppRoutingReuseStrategyService } from './app-routing-reuse-strategy.service';

import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GravatarModule } from './gravatar/gravatar.module';

import { environment } from '../environments/environment';

import { EthService } from './eth.service';
import { TypeformService } from './typeform.service';
import { PaginationService } from './pagination.service';

import { TopComponent } from './top/top.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { GridComponent } from './grid/grid.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';

// { provide: RouteReuseStrategy, useClass: AppRoutingReuseStrategyService },
@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    HomeComponent,
    PageNotFoundComponent,
    GridComponent,
    AdminComponent,
    DashboardComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    // AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    // AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    InfiniteScrollModule,
    GravatarModule
  ],
  providers: [DatePipe, EthService, TypeformService, PaginationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
