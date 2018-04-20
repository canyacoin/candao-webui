import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// AngularFirestoreCollection
import { AngularFirestore } from 'angularfire2/firestore';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/combineLatest';

import { EthService } from '../eth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  query = '';

  providers = [];
  searchResults: any = null;

  // startAt = new Subject();
  // endAt = new Subject();
  // startObs = this.startAt.asObservable();
  // endObs = this.endAt.asObservable();

  // Flags
  loading = true;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private ethService: EthService,
    private afs: AngularFirestore) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.query = params['query'] ? params['query'] : '';
      console.log('ngAfterViewInit', this.query === '' ? 'Empty' : this.query);
      this.loadData();
    });
  }

  loadData() {
    this.afs.collection('all', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe( (data: any) => {
      this.providers = data;
      this.onSearch();
    });

    // Observable.combineLatest( this.startObs, this.endObs ).subscribe( (terms: any) => {
    //   this.onFireQuery( terms[0], terms[1] ).subscribe( (data) => {
    //     this.loading = false;
    //     this.searchResults = data;
    //   });
    // });
    // this.onSearch();
  }

  async onAddToWhitelist(object: any) {
    try {
      console.log('onAddToWhitelist', object.address);
      // this.all.splice(object.i, 1);
      await this.ethService.addProvider(object.address);
      this.afs.collection('providers').doc( object.address ).set( object );
      this.afs.collection('rejected').doc( object.address ).delete();
    } catch (error) {
      console.log('onAddToWhitelist - error', error);
    }
  }

  async onActivateProfile(object: any) {
    try {
      console.log('onActivateProfile', object.address);
      await this.ethService.activateProvider(object.address);
      this.afs.collection('active').doc( object.address ).set( object );
      this.afs.collection('rejected').doc( object.address ).delete();
    } catch (error) {
      console.log('onActivateProfile - error', error);
    }
  }

  async onRejectProvider(object: any) {
    try {
      console.log('onActivateProfile', object.address);
      await this.ethService.rejectProvider(object.address);
      this.afs.collection('rejected').doc( object.address ).set( object );
      this.afs.collection('providers').doc( object.address ).delete();
      this.afs.collection('active').doc( object.address ).delete();
    } catch (error) {
      console.log('onRejectProvider - error', error);
    }
  }

  // onSearch() {
  //   this.loading = true;
  //   this.searchResults = null;
  //   console.log('onSearch', this.query === '' ? 'Empty' : this.query);
  //   if (this.query !== '') {
  //     this.startAt.next(this.query);
  //     this.endAt.next(this.query + '\uf8ff');
  //   }
  // }

  onSearch() {
    this.loading = true;
    this.searchResults = [];
    console.log('onSearch', this.query === '' ? 'Empty' : this.query);
    if (this.query !== '') {
      const tmpUsers: any = [];
      this.providers.map((item) => {
        if (JSON.stringify(item).toLowerCase().includes(this.query.toLowerCase())) {
          tmpUsers.push(item);
        }
      });
      this.searchResults = tmpUsers;
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  // onFireQuery(start, end) {
  //   return this.afs.collection('all', ref => ref.limit(10).orderBy('timestamp', 'desc').startAt(start).endAt(end)).valueChanges();
  // }

  onSubmit(event: any) {
    if ( (<any>window).$('html, body') ) {
      (<any>window).$('html, body').animate({scrollTop : -10}, 600);
    }
    this.router.navigate(['search', event]);
  }
}
