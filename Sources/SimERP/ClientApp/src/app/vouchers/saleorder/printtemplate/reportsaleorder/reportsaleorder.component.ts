import {Component, Input, OnInit} from '@angular/core';
import {SaleInvoice} from '../../model/saleorder';

@Component({
  selector: 'app-reportsaleorder',
  templateUrl: './reportsaleorder.component.html',
  styleUrls: ['./reportsaleorder.component.css']
})
export class ReportsaleorderComponent implements OnInit {

  @Input() model: SaleInvoice;

  constructor() {

  }

  ngOnInit() {
  }

}
