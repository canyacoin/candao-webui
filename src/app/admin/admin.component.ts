import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EthAddressValidator } from '../validators/address';

import { AngularFirestore } from 'angularfire2/firestore';

import { EthService } from '../eth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Models
  admins = [];
  mods = [];

  // Forms
  adminForm: FormGroup = null;
  modForm: FormGroup = null;
  badgeForm: FormGroup = null;
  sending = false;
  currentTab = 'Admins';
  currentBadge = 'Loading...';

  constructor(private router: Router,
    // private location: Location,
    private formBuilder: FormBuilder,
    private ethService: EthService,
    private afs: AngularFirestore) {

    this.adminForm = formBuilder.group({
      ethAddress: ['', Validators.compose([Validators.required, EthAddressValidator.isValid])],
    });

    this.modForm = formBuilder.group({
      ethAddress: ['', Validators.compose([Validators.required, EthAddressValidator.isValid])],
    });

    this.badgeForm = formBuilder.group({
      badge: ['', Validators.compose([Validators.required, Validators.min(2), Validators.maxLength(32)])],
    });
  }

  async ngOnInit() {
    this.loadData();

    this.currentBadge = await this.ethService.getCurrentBadge();
    // this.ethService.initWeb3();
  }

  // isValidAddress(addr: string) {
  //   this.ethService.initWeb3();
  //   console.log('isValidAddress', this.ethService.web3.utils.isAddress( addr ) );
  //   return this.ethService.web3.utils.isAddress( addr );
  // }

  // onBack(event: any) {
  //   event.preventDefault();
  //   if ( (<any>window).$('html, body') ) {
  //     (<any>window).$('html, body').animate({scrollTop : 0}, 600);
  //   }
  //   this.location.back();
  // }

  loadData() {
    this.afs.collection( 'admins', ref => ref.orderBy('timestamp', 'desc') ).valueChanges().subscribe( (data: any) => {
      this.admins = data;
    });

    this.afs.collection( 'mods', ref => ref.orderBy('timestamp', 'desc') ).valueChanges().subscribe( (data: any) => {
      this.mods = data;
    });
  }

  async onAddUser(type: string) {
    try {
      // if (this.adminForm.value.ethAddress === undefined
      //   || this.adminForm.value.ethAddress === null
      //   || !this.isAddress(this.adminForm.value.ethAddress)) {
      //   this.adminForm.get('ethAddress').setErrors({ 'invalidAddress': true });
      //   this.adminForm.updateValueAndValidity();
      //   return;
      // }
      const ethAddress = type === 'admins' ? this.adminForm.value.ethAddress : this.modForm.value.ethAddress;

      this.sending = true;
      this.afs.collection( type ).doc( ethAddress ).set({
        ethAddress: ethAddress,
        timestamp: moment().format('x')
      });

      if (type === 'admins') {
        await this.ethService.addAdmin( ethAddress );
        console.log('onAddUser - address', ethAddress);
      }

      if (type === 'mods') {
        await this.ethService.addMod( ethAddress );
      }

      console.log('onAddUser - address', ethAddress);
      this.sending = false;

    } catch (error) {
      console.log('onAddUser - error', error);
      this.sending = false;
    }
  }

  async onDeleteUser(type: string, item: any) {
    try {
      item['removing'] = true;
      this.afs.collection( type ).doc( item.ethAddress ).delete();

      if (type === 'admins') {
        await this.ethService.removeAdmin( item.ethAddress );
      }

      if (type === 'mods') {
        await this.ethService.removeMod( item.ethAddress );
      }

    } catch (error) {
      console.log('onAddAdmin - error', error);
      item['removing'] = false;
    }
  }

  async onChangeBadge() {
    try {
      this.sending = true;
      this.afs.collection( 'settings').doc( 'badge' ).set( { current: this.badgeForm.value.badge } );
      await this.ethService.setCurrentBadge( this.badgeForm.value.badge );
      this.sending = false;
      this.currentBadge = await this.ethService.getCurrentBadge();
    } catch (error) {
      console.log('onChangeBadge - error', error);
      this.sending = false;
    }
  }

}
