import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-zorrocustom',
  templateUrl: './zorrocustom.component.html',
  styleUrls: ['./zorrocustom.component.css']
})
export class ZorrocustomComponent implements OnInit {
  selectedValue: any;
  date: any;
  checked: any;

  constructor() { }

  ngOnInit() {
  }

  onChangeDate($event: any) {
    
  }
}
