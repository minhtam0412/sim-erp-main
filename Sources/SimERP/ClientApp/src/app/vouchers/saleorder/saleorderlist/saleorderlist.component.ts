import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ListVoucherStatus} from '../../../common/masterdata/commondata';
import {PaginationComponent} from '../../../pagination/pagination.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ProductCategoryService} from '../../../lists/productcategory/product-category.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {SaleorderdetailComponent} from '../saleorderdetail/saleorderdetail.component';
import {SaleorderService} from '../saleorder.service';
import * as moment from 'moment';
import {SaleInvoice} from '../model/saleorder';
import {Key_Locale_BsDatePicker, Key_Theme_BsDatePicker} from '../../../common/config/globalconfig';

@Component({
  selector: 'app-saleorderlist',
  templateUrl: './saleorderlist.component.html',
  styleUrls: ['./saleorderlist.component.css']
})
export class SaleorderlistComponent implements OnInit, AfterViewInit {

  constructor(private service: SaleorderService, private modalService: NgbModal,
              private masterdataService: MasterdataService, private  productCategoryService: ProductCategoryService,
              private  notificationService: NotificationService, private router: Router, private localeService: BsLocaleService) {
    SaleorderlistComponent.loadCommonData().subscribe(res => {
    });
  }

  @ViewChild(PaginationComponent, {static: true}) pagingComponent: PaginationComponent;
  total = 10;
  page = 1;
  limit = 15;

  lstStatus = ListVoucherStatus;
  voucherStatus = -1;
  searchString = '';
  fromDate: Date;
  toDate: Date;
  lstDataResult: SaleInvoice[] = [];

  // setup datetimepicker
  bsConfig: Partial<BsDatepickerConfig>;
  locale = Key_Locale_BsDatePicker;
  colorTheme = Key_Theme_BsDatePicker;

  static loadCommonData(): Observable<any[]> {
    return forkJoin([]);
  }

  ngOnInit() {
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, {containerClass: this.colorTheme, showWeekNumbers: false});
  }

  loadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    const voucherStatus = Number(this.voucherStatus) === -1 ? null : Number(this.voucherStatus);
    const fromDate = this.fromDate != null ? moment.utc(this.fromDate).local().toDate() : null;
    const toDate = this.toDate != null ? moment.utc(this.toDate).local().toDate() : null;

    this.service.getData(this.searchString, startRow, limit, fromDate, toDate, voucherStatus).subscribe(
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

  // mở dialog insert/update
  showDialog(productId?: any) {
    const modalRef = this.modalService.open(SaleorderdetailComponent, {
      backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'xl'
    });

    modalRef.componentInstance.bsConfig = this.bsConfig;
    if (productId === undefined || productId == null) {
      modalRef.componentInstance.isAddState = true;
    } else {
      modalRef.componentInstance.isAddState = false;
      modalRef.componentInstance.productId = productId;
    }

    // callback xử lý sau khi đóng dialog
    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        const startRow = this.getStartRow();
        this.loadData(startRow);
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  clearVoucherStatus() {
    this.voucherStatus = -1;
  }

  searchAction() {
    this.page = 1;
    this.loadData(0);
  }


  showConfirmDeleteDialog(row) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        this.deleteData(row);
      }
    });
  }

  deleteData(row) {
    this.service.delete(row).subscribe(res => {
      if (res && res.IsOk && res.RepData === true) {
        this.notificationService.showSucess('Xoá thành công!');
        const startRow = this.getStartRow();
        this.loadData(startRow);
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

  showVoucherStatus(VoucherStatus: number) {
    let rsl = '';
    switch (VoucherStatus) {
      case 1:
        rsl = 'Đang xử lý';
        break;
      case 2:
        rsl = 'Hoàn tất';
        break;
      case 3:
        rsl = 'Huỷ';
        break;
      default:
        rsl = 'Chưa xử lý';
        break;
    }
    return rsl;
  }
}
