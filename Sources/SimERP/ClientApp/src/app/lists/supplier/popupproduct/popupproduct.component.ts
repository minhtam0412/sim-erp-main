import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../product/model/product';
import {ProductService} from '../../product/product.service';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Vendor} from '../model/vendor';
import {NotificationService} from '../../../common/notifyservice/notification.service';

@Component({
  selector: 'app-popupproduct',
  templateUrl: './popupproduct.component.html',
  styleUrls: ['./popupproduct.component.css']
})
export class PopupproductComponent implements OnInit {

  model: Product = new Product();
  @Input() vendor: Vendor;

  autocompleteHeaderTemplate = `
  <div class="header-row">
  <div class="col-2">Mã hàng</div>
  <div class="col-3">Tên hàng</div>
  <div class="col-1">ĐVT</div>
  <div class="col-3">Ngành hàng</div>
  </div>`;

  lstProduct: Product[] = [];
  resultDialog = true;
  productCode: string;

  constructor(private productService: ProductService, private masterdataService: MasterdataService, private activeModal: NgbActiveModal,
              private notificationService: NotificationService) {
    this.loadCommonData().subscribe(res => {
      this.lstProduct = (res[0] as ResponeResult).RepData;
    });
  }

  ngOnInit() {
  }


  loadCommonData(): Observable<any[]> {
    const resProduct = this.masterdataService.getProductData();
    return forkJoin([resProduct]);
  }

  renderDataRowAutoComplete(data: Product): string {
    const html = `
      <div class="data-row">
        <div class="col-2">${data.ProductCode}</div>
        <div class="col-3">${data.ProductName}</div>
        <div class="col-1">${data.UnitName}</div>
        <div class="col-3">${data.ProductCategoryName}</div>
      </div>`;
    return html;
  }

  autocompleteCallback(productCode) {
    this.model = this.lstProduct.find(x => x.ProductCode === productCode);
    if (this.checkExistProduct(productCode)) {
      this.notificationService.showInfo('Sản phẩm đã được thêm vào danh sách! Vui lòng chọn sản phẩm khác!');
      this.resultDialog = false;
    }
    this.productCode = this.model.ProductCode;
  }

  closeDialog() {
    this.activeModal.close();
  }

  checkExistProduct(productCode): boolean {
    if (this.vendor === undefined || this.vendor.ListVendorProduct === undefined || this.vendor.ListVendorProduct == null) {
      return false;
    }

    const index = this.vendor.ListVendorProduct.findIndex(value => {
      return value.ProductCode === productCode;
    });
    return index > -1;
  }

  saveData() {
    if (!this.resultDialog) {
      this.model = null;
    }
    this.activeModal.close(this.model);
  }
}
