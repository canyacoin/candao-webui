import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/share';
import { environment } from '../environments/environment';

declare let require: any;

const Web3 = require('web3');
const contract = require('truffle-contract');

const daoArtifacts = require('../../build/contracts/CanYaDao.json');
const gas = {gasPrice: '8000000000', gas: '210000'};

@Injectable()
export class EthService {

  // Web3
  account: string = null;
  web3: any = null;
  canYaDaoContract = contract(daoArtifacts);

  web3InitObservable: Observable<any> = null;
  web3InitObserver: Observer<any> = null;

  constructor() {
    this.web3InitObservable = new Observable((wobserver) => {
      this.web3InitObserver = wobserver;
    }).share();
    
    this.web3InitObservable.subscribe();

    this.initWeb3();
  }

  async initWeb3() {
    try {
      if (typeof (<any>window).web3 !== 'undefined') {
        this.web3 = new Web3( (<any>window).web3.currentProvider );
        this.canYaDaoContract.setProvider(this.web3.currentProvider);

        this.web3InitObserver.next({ isMetaMaskAvailable: this.web3.currentProvider.isMetaMask, isWalletUnlocked: false, netId: -1 });

        this.web3.eth.net.getId().then(async (netId) => {
          if (environment.production && netId !== 1) {
            this.web3InitObserver.next({ isMetaMaskAvailable: this.web3.currentProvider.isMetaMask, isWalletUnlocked: false, netId: netId });
          } else {
            this.web3.eth.getAccounts(async (err, accs) => {
              if (err === null && accs.length > 0) {
                this.account = (accs[0]);
                this.web3.eth.defaultAccount = this.account;

                console.log('EthService - account', this.account, 'isWalletUnlocked', this.account ? true : false);
                this.web3InitObserver.next({ isMetaMaskAvailable: this.web3.currentProvider.isMetaMask, isWalletUnlocked: this.account ? true : false, netId: netId });
              } else {
                this.web3InitObserver.next({ isMetaMaskAvailable: this.web3.currentProvider.isMetaMask, isWalletUnlocked: false, netId: netId });
              }
            });
          }
        });
      } else {
        setTimeout( () => {
          console.log('Please use a dapp browser like mist or MetaMask plugin for chrome');
          this.web3InitObserver.next({ isMetaMaskAvailable: false, isWalletUnlocked: false, netId: -1 });
        }, 2000);
      }
    } catch (error) {
      console.error('initWeb3 - error', error);
    }
  }

  async isAdmin(): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const isAdmin = await canYaDao.isAdmin.call( this.account );
        resolve(isAdmin);
      } catch (error) {
        console.log('isAdmin - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async isMod(): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const isMod = await canYaDao.isMod.call( this.account );
        resolve(isMod);
      } catch (error) {
        console.log('isMod - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async addAdmin(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('addAdmin', canYaDao, address);
        await canYaDao.addAdmin(address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('addAdmin - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async removeAdmin(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('removeAdmin', canYaDao, address);
        await canYaDao.removeAdmin(address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('removeAdmin - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async addMod(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('addMod', canYaDao, address);
        await canYaDao.addMod(address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('addMod - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async removeMod(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('removeMod', canYaDao, address);
        await canYaDao.removeMod(address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('removeMod - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async isProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const isProvider = await canYaDao.isProvider.call( address );
        resolve(isProvider);
      } catch (error) {
        console.log('isProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async isActive(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const isActive = await canYaDao.isActive.call( address );
        resolve(isActive);
      } catch (error) {
        console.log('isActive - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async isRejected(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const isRejected = await canYaDao.isRejected.call( address );
        resolve(isRejected);
      } catch (error) {
        console.log('isRejected - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async addProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('addProvider', canYaDao, address);
        await canYaDao.addProvider( address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('addProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async activateProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('activateProvider', canYaDao, address);
        await canYaDao.activateProvider( address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('activateProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async deactivateProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('deactivateProvider', canYaDao, address);
        await canYaDao.deactivateProvider( address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('deactivateProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async accceptProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('accceptProvider', canYaDao, address);
        await canYaDao.accceptProvider( address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('accceptProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

  async rejectProvider(address: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('rejectProvider', canYaDao, address);
        await canYaDao.rejectProvider( address, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('rejectProvider - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }


  async getCurrentBadge(): Promise<string> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        const badge = await canYaDao.currentBadge.call();
        resolve( this.web3.utils.toAscii( badge ) );
      } catch (error) {
        console.log('getCurrentBadge - error', error);
        reject(error);
      }
    }) as Promise<string>;
  }

  async setCurrentBadge(badge: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const canYaDao = await this.canYaDaoContract.deployed();
        console.log('setCurrentBadge', canYaDao, badge);
        await canYaDao.setCurrentBadge(badge, {from: this.account, ...gas});
        resolve(true);
      } catch (error) {
        console.log('setCurrentBadge - error', error);
        reject(error);
      }
    }) as Promise<boolean>;
  }

}
