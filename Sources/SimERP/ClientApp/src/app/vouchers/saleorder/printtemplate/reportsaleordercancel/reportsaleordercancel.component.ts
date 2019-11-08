import {Component, Input, OnInit} from '@angular/core';
import {SaleInvoice} from '../../model/saleorder';

@Component({
  selector: 'app-reportsaleordercancel',
  templateUrl: './reportsaleordercancel.component.html',
  styleUrls: ['./reportsaleordercancel.component.css']
})
export class ReportsaleordercancelComponent implements OnInit {

  @Input() model: SaleInvoice;
  constructor() { }

  ngOnInit() {
  }

}
