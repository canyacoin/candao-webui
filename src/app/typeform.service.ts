import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { EthService } from './eth.service';

declare let require: any;

const Web3 = require('web3');

// import orderBy from 'lodash/orderBy';
import * as moment from 'moment';

@Injectable()
export class TypeformService {

  // 'https://api.typeform.com/v1/form/R9gv3i?key=081562f9fd86f05daead132e235ccc15671b0253&completed=true';
  typeformUrl = 'https://api.typeform.com/v1/form/r2Bfb0?key=081562f9fd86f05daead132e235ccc15671b0253&order_by[]=date_submit,desc&completed=true';

  web3: any = null;

  constructor(public http: Http,
    private ethService: EthService) {

    this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/XK1wLa9Qe4yFtT25eG9l'));
    console.log('TypeformService - constructor', this.web3);
  }

  getPioneers(): Observable<{} | any[]> {
    try {
      // return Observable.timer(0, 60000).concatMap(() => {
      return this.http.get(`${this.typeformUrl}`)
        .map(this.extractData.bind(this))
        .catch(this.handleError);
      // });
    } catch (error) {
      console.log('TypeformService - error', error);
    }
  }

  isValidAddress(address: string) {
    return this.web3.utils.isAddress(address);
  }

  extractData(res: Response) {
    const body = res.json().responses;
    const results = [];

    body.map( (item) => {
      if ( this.isValidAddress( item['answers']['textfield_gklk3UOWQxgj'] || 'Empty' ) ) {
        results.push({
          key: item['token'] || 'Empty',
          name: item['answers']['textfield_vTgZwE4Y3I6Y'] || 'Empty',
          telegram: item['answers']['textfield_F71roLDpOUb4'] || 'Empty',
          email: item['answers']['email_aKWCXIDFcnZR'] || 'Empty',
          mailto: 'mailto:' + item['answers']['email_aKWCXIDFcnZR'] + '?Subject=CanYa%20Pioneers' || 'Empty',
          category: {
            'Content Creator': item['answers']['list_Xt43TTUriX4l_choice_Z3VlnlERPv9T'] || 'Empty',
            'Graphics Designers': item['answers']['list_Xt43TTUriX4l_choice_cyBbOu3teKSt'] || 'Empty',
            'Software Developers': item['answers']['list_Xt43TTUriX4l_choice_sUg8Msr1zCgQ'] || 'Empty',
            'Virtual Assistants': item['answers']['list_Xt43TTUriX4l_choice_giQFciGp9pZO'] || 'Empty',
            'Other': item['answers']['list_Xt43TTUriX4l_choice_dprOpy5gv2nz'] || 'Empty'
          },
          other: item['answers']['textfield_Uqs4XSW4sjjd'] || 'Empty',
          portfolio: item['answers']['textfield_aXIiq2m0rYUK'] || 'Empty',
          resume: item['answers']['fileupload_vAgpmuGlZ3rE'] || 'Empty',
          crypto: item['answers']['listimage_AK1plCGY9qOb_choice'] || 'Empty',
          canya: item['answers']['listimage_SvUunmYWfeLW_choice'] || 'Empty',
          why: item['answers']['textarea_UCokvzmwA4R5'] || 'Empty',
          value: item['answers']['textarea_MAzgSOUXLTBo'] || 'Empty',
          feedback: item['answers']['listimage_KthMPDQiWsEc_choice'] || 'Empty',
          ethAddress: item['answers']['textfield_gklk3UOWQxgj'] || 'Empty',
          timestamp: moment( item['metadata']['date_submit'] ).format('x')
        });
      }
    });

    // results = orderBy(results, ['timestamp'], ['asc']);
    return results || [];
  }

  handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Typeform Server error';
    console.error(error);
    return errMsg; // Observable.throw(errMsg);
  }
}
