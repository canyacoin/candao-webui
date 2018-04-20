import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  @Input() providers: Array<any> = [];
  @Input() hideAddToWhitelist: Boolean = false;
  @Input() hideActivateProfile: Boolean = false;
  @Input() hideRejectProvider: Boolean = false;
  @Output() addToWhitelist: EventEmitter<any> = new EventEmitter();
  @Output() activateProfile: EventEmitter<any> = new EventEmitter();
  @Output() rejectProvider: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  showSpinner(index: number) {
    this.providers[index]['confirming'] = true;

    setTimeout( () => {
      this.providers[index]['confirming'] = false;
    }, 40000);
  }

  onAddToWhitelist(index: number, address: string) {
    this.showSpinner(index);
    console.log('GridComponent - onAddToWhitelist', index, address);
    this.addToWhitelist.emit( { index: index, address: address } );
  }

  onActivateProfile(index: number, address: string) {
    this.showSpinner(index);
    console.log('GridComponent - onActivateProfile', index, address);
    this.activateProfile.emit( { index: index, address: address } );
  }

  onRejectProvider(index: number, address: string) {
    this.showSpinner(index);
    console.log('GridComponent - onActivateProfile', index, address);
    this.rejectProvider.emit( { index: index, address: address } );
  }

}
