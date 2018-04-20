import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFirestore } from 'angularfire2/firestore';
import { PaginationService } from '../pagination.service';
import 'rxjs/add/operator/take';

import { EthService } from '../eth.service';
import { TypeformService } from '../typeform.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // Current user?
  currentUser: any = JSON.parse(localStorage.getItem('credentials'));

  // List
  all = [];
  pioneers = [];
  rejected = [];
  currentTab = 'All';
  total = 0;

  // Flags
  isAdmin = false;
  started = false;
  state = 'loading';

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private ethService: EthService,
    private typeformService: TypeformService,
    private afs: AngularFirestore,
    private page: PaginationService) {

  }

  ngOnInit() {
    this.loadPioneers();
    this.page.init('all', 'timestamp', { reverse: true, prepend: false });
    this.updatePioneers();
  }

  ngAfterViewInit() {
    // this.activatedRoute.params.subscribe((params) => {
      // PARAM? = params['query'] ? params['query'] : '';
    // });
    if (this.state === 'loading') {
      this.getWeb3State();
    }
  }

  getWeb3State() {
    this.ethService.initWeb3();
    this.ethService.web3InitObservable.subscribe( async (state) => {
      console.log('getWeb3State - state', state);
      if (!state.isMetaMaskAvailable) {
        this.state = 'metaMaskNotAvailable';
      } else if (state.isMetaMaskAvailable && state.netId !== 1) {
        this.state = 'switchToMainNet';
      } else if (state.isMetaMaskAvailable && state.netId === 1 && !state.isWalletUnlocked) {
        this.state = 'walletLocked';
      } else {
        if ( this.ethService.account ) {
          const isMod = await this.ethService.isMod();
          if ( isMod ) {
            this.state = 'logged';
            // this.ethService.addAdmin();
          } else {
            this.state = 'accessDenied';
          }
          console.log('getWeb3State - isMod', isMod);
          this.isAdmin = await this.ethService.isAdmin();
          console.log('getWeb3State - isAdmin', this.isAdmin);
        } else {
          this.state = 'metaMaskNotAvailable';
        }
      }
    });
  }

  cacheItem(collection: string, item: any) {
    setTimeout( () => {
      this.afs.collection( collection ).doc( item.ethAddress ).set( item );
    }, 1000 );
    // this.afs.collection( collection ).doc( item.ethAddress ).snapshotChanges().take(1).subscribe( (snap: any) => {
    //   return snap.payload.exists ? this.afs.collection( collection ).doc( item.ethAddress ).update( item ) : this.afs.collection( collection ).doc( item.ethAddress ).set( item );
    // });
  }

  removeItem(collection: string, item: any) {
    setTimeout( () => {
      this.afs.collection( collection ).doc( item.ethAddress ).delete();
    }, 1000 );
  }

  updatePioneers() {
    this.typeformService.getPioneers().subscribe( (typeformData: Array<any>) => {
      // console.log('updatePioneers', typeformData, typeformData instanceof Array);
      if ( typeformData instanceof Array ) {
        this.total = typeformData.length;
        typeformData.map( async (item) => {
          const isProvider = await this.ethService.isProvider( item.ethAddress );
          const isRejected = await this.ethService.isRejected( item.ethAddress );

          // console.log('updatePioneers', isProvider, isRejected);

          if ( isRejected ) {
            this.removeItem('all', item);
            this.removeItem('providers', item);
            this.cacheItem('rejected', item);
          } else if ( isProvider ) {
            this.removeItem('all', item);
            this.cacheItem('providers', item);
            this.removeItem('rejected', item);
          } else {
            this.cacheItem('all', item);
            this.removeItem('providers', item);
            this.removeItem('rejected', item);
          }
        });
      }
    });
  }

  loadPioneers() {
    // this.afs.collection( 'all', ref => ref.orderBy('timestamp', 'desc') ).valueChanges().subscribe( (data: any) => {
    //   this.all = [];
    //   data.map( (item) => {
    //     this.all.push(item);
    //   });
    // });

    this.afs.collection( 'providers', ref => ref.orderBy('timestamp', 'desc') ).valueChanges().subscribe( (data: any) => {
      this.pioneers = [];
      data.map( (item) => {
        this.pioneers.push(item);
      });
    });

    this.afs.collection( 'rejected', ref => ref.orderBy('timestamp', 'desc') ).valueChanges().subscribe( (data: any) => {
      this.rejected = [];
      data.map( (item) => {
        this.rejected.push(item);
      });
    });
  }

  onTab(tabOption: string) {
    // console.log('onTab', tabOption);
    this.currentTab = tabOption;
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

  onScroll(event: any) {
    if ( this.currentTab === 'All' ) {
      this.page.more();
    }
  }

  onSubmit(event: any) {
    if ( (<any>window).$('html, body') ) {
      (<any>window).$('html, body').animate({scrollTop : -10}, 600);
    }
    this.router.navigate(['search', event]);
  }
}
