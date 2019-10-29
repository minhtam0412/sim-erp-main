import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProductdetailComponent} from '../../product/productdetail/productdetail.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ProductCategoryService} from '../../productcategory/product-category.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {SupplierService} from '../supplier.service';
import {Router} from '@angular/router';
import {ListStatus} from '../../../common/masterdata/commondata';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {PaginationComponent} from '../../../pagination/pagination.component';
import {Vendor} from '../model/vendor';
import {VendorType} from '../../vendortype/model/vendortype';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';

@Component({
  selector: 'app-supplierlist',
  templateUrl: './supplierlist.component.html',
  styleUrls: ['./supplierlist.component.css']
})
export class SupplierlistComponent implements OnInit, AfterViewInit {
  lstStatus = ListStatus;
  isActive = -1;
  searchString = '';
  vendorTypeId = -1;
  @ViewChild(PaginationComponent, {static: true}) pagingComponent: PaginationComponent;
  lstDataResult: Vendor[] = [];
  total = 10;
  page = 1;
  limit = 15;
  lstVendorType: VendorType[] = [];

  constructor(private service: SupplierService, private modalService: NgbModal,
              private masterdataService: MasterdataService, private  productCategoryService: ProductCategoryService,
              private  notificationService: NotificationService, private router: Router) {
    this.loadCommonData().subscribe(res => {
      this.lstVendorType = (res[0] as ResponeResult).RepData;
    });
  }

  ngOnInit() {

  }

  loadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.service.getData(this.searchString, Number(this.isActive) === -1 ? null : Number(this.isActive),
      this.vendorTypeId, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.notificationService.showError(res.MessageText);
          } else {
            this.lstDataResult = res.RepData;
            this.total = res.TotalRow;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
        }
      }
    );
  }


  loadCommonData(): Observable<any[]> {
    const resVendorType = this.masterdataService.getVendorTypeData();
    return forkJoin([resVendorType]);
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

  clearIsActive() {
    this.isActive = -1;
  }

  searchAction() {
    this.page = 1;
    this.loadData(0);
  }

  clearVendorType() {
    this.vendorTypeId = -1;
  }

  showConfirmDeleteDialog(vendor) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        this.deleteData(vendor);
      }
    });
  }

  deleteData(row) {
    this.service.delete(row).subscribe(res => {
      if (res && res.IsOk && res.RepData === true) {
        this.notificationService.showSucess('Xoá thành công!');
        this.searchAction();
      } else {
        this.notificationService.showError(res.MessageText);
      }
    }, err => {
      console.log(err);
      this.notificationService.showError('Lỗi xoá thông tin! Vui lòng liên hệ quản trị hệ thống!');
    });
  }

  getStartRow(): number {
    return (this.page - 1) * this.pagingComponent.getLimit();
  }

  goToPage(n: number): void {
    this.page = n;
    const startRow = this.getStartRow();
    this.loadData(startRow);
  }

  changeLimit() {
    this.page = 1;
    const startRow = this.getStartRow();
    this.loadData(startRow);
  }

  onNext(): void {
    this.page++;
    const startRow = this.getStartRow();
    this.loadData(startRow);
  }

  onPrev(): void {
    this.page--;
    const startRow = this.getStartRow();
    this.loadData(startRow);
  }

  ngAfterViewInit(): void {
    this.searchAction();
  }
}
