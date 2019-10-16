import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Merchandise, MerchandiseInfo } from '../models/purchase';

@Component({
  selector: 'app-purchasedetailinfo',
  templateUrl: './purchasedetailinfo.component.html',
  styleUrls: ['./purchasedetailinfo.component.css']
})
export class PurchasedetailinfoComponent implements OnInit {
  
  lst_Merchandise: Merchandise[] = [];
  MerchandiseInfo: MerchandiseInfo;
  
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  constructor() { }

  chooseFile() {
    let event = new MouseEvent('click', { bubbles: false });
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  ngOnInit() {
  
  }

  onChangeFile($event) {

  }

  addRowGird_HangHoa(){
    var row = new Merchandise();
    row.Code = "";
    row.Name = "";
    row.Unit = "";
    row.Amount = 0;
    row.Price = 0;
    row.Money = 0;
    row.Promotion = 0;
    row.VAT = 0;
    row.TotalMoney = 0;
    row.QD_HSD = 0;
    row.ExpiryDate = new Date();
    row.TotalMoney = 0;

    this.lst_Merchandise.push(row);
  }

  deleteRowGird_hanghoa(index){
    this.lst_Merchandise.splice(index, 1);
  }

  submitData(){
    console.log("submitData");
    console.log(this.lst_Merchandise);
  }

}
