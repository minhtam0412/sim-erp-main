import {Component, OnInit} from '@angular/core';
import {ProductdetailComponent} from '../../product/productdetail/productdetail.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ProductCategoryService} from '../../productcategory/product-category.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {SupplierService} from '../supplier.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-supplierlist',
  templateUrl: './supplierlist.component.html',
  styleUrls: ['./supplierlist.component.css']
})
export class SupplierlistComponent implements OnInit {

  constructor(private service: SupplierService, private modalService: NgbModal, private toastr: ToastrService,
              private masterdataService: MasterdataService, private  productCategoryService: ProductCategoryService,
              private  notificationService: NotificationService, private router: Router) {
  }

  ngOnInit() {
  }

  // mở dialog insert/update
  showDialog(productId?: any) {
    const modalRef = this.modalService.open(ProductdetailComponent, {
      backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'xl'
    });

    if (productId === undefined || productId == null) {
      modalRef.componentInstance.isAddState = true;
    } else {
      modalRef.componentInstance.isAddState = false;
      modalRef.componentInstance.productId = productId;
    }

    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        console.log(result);
        // const startRow = this.getStartRow();
        // this.LoadData(startRow);
      }
    }, (reason) => {
      console.log(reason);
    });
  }

}
