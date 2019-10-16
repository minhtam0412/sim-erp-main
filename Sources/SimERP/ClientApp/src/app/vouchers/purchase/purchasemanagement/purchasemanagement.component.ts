import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Tax } from 'src/app/lists/taxcomponent/models/Tax';
import { Purchase } from '../models/purchase';

@Component({
  selector: 'app-purchasemanagement',
  templateUrl: './purchasemanagement.component.html',
  styleUrls: ['./purchasemanagement.component.css']
})
export class PurchasemanagementComponent implements OnInit {
  headElements = ['#', 'Số CT', 'Ngày CT', 'Ngày HT', 'CT gốc', 'Mã NCC', 'Nhà cung cấp', 'Người tạo', 'Tổng tiền', 'Ghi sổ', ' '];
  frmSearch: FormGroup;
  purchaseList: Purchase[] = [];
  loading = false;
  total = 10;
  page = 1;
  limit = 10;


  constructor() { }

  ngOnInit() {

    this.frmSearch = new FormGroup({
      searchString: new FormControl(),
      saveBook: new FormControl(),

    });

    this.searchData();
  }

  searchData() {
    for (let index = 0; index < this.total; index++) {
      const purchase = new Purchase();
      purchase.PurchaseCode = 'MH/00037/0919';
      purchase.VoucherDate = new Date();
      purchase.AccountingDate = new Date();
      purchase.ReferenceCode = '0178716';
      purchase.VendorCode = 'PHARMEDIC';
      purchase.VendorName = 'CÔNG TY CỔ PHẦN DƯỢC PHẨM DƯỢC LIỆU PHARMEDIC';
      purchase.UserName = 'Trần Ngọc Lợi';
      purchase.TotalAmount = 935000;
      this.purchaseList.push(purchase);
    }
  }

  goToPage(n: number): void {
    this.page = n;
  }

  changeLimit() {
    this.page = 1;
  }

  onNext(): void {
    this.page++;
  }

  onPrev(): void {
    this.page--;;
  }
}
