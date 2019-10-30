import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PaginationComponent} from '../../../pagination/pagination.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenService} from '../../../systems/authen.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {ExchangeRate} from '../model/exchangerate';
import {ExchangerateService} from '../exchangerate.service';
import {ExchangeratedetailComponent} from '../exchangeratedetail/exchangeratedetail.component';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';
import {Currency} from '../../currency/model/currency';
import * as moment from 'moment';

@Component({
  selector: 'app-exchangeratelist',
  templateUrl: './exchangeratelist.component.html',
  styleUrls: ['./exchangeratelist.component.css']
})
export class ExchangeratelistComponent implements OnInit, AfterViewInit {

  // setup datetimepicker
  locale = 'vi';
  colorTheme = 'theme-blue';

  dataIsAvailable: boolean; // xác định có data trả về khi tìm kiếm
  lstDataResult: ExchangeRate[] = []; // danh sách CustomerType
  page = 1; // chỉ số trang hiện tại
  limit = 10; // số record cần hiển thị trên 1 trang
  total = 10; // tổng số record trả về
  searchString: string; // binding textbox
  isActive = -1; // binding combo Trạng thái
  fromDate: Date = null;
  toDate: Date = null;
  lstCurrency: Currency[] = [];

  @ViewChild(PaginationComponent, {static: false}) pagingComponent: PaginationComponent;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private modalService: NgbModal, private service: ExchangerateService,
              private authenService: AuthenService, private notificationService: NotificationService,
              private localeService: BsLocaleService, private masterdataService: MasterdataService) {
    this.loadCommonData().subscribe(res => {
      this.lstCurrency = (res[0] as ResponeResult).RepData;
    });
  }

  ngOnInit() {
    this.localeService.use(this.locale);
    this.bsConfig = Object.assign({}, {containerClass: this.colorTheme, showWeekNumbers: false});
  }

  loadCommonData(): Observable<any[]> {
    const reqCurrency = this.masterdataService.getCurrencyData();
    return forkJoin([reqCurrency]);
  }

  // tìm kiếm dữ liệu
  searchData() {
    this.page = 1;
    this.LoadData(0);
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    const isActive = Number(this.isActive) === -1 ? null : Number(this.isActive);
    const fromDate = moment.utc(this.fromDate).local().toDate();
    const toDate = moment.utc(this.toDate).local().toDate();
    this.service.getData(this.searchString, isActive, startRow, limit, fromDate, toDate).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.notificationService.showError(res.MessageText);
            this.lstDataResult = [];
            this.total = 0;
            this.dataIsAvailable = false;
          } else {
            this.lstDataResult = res.RepData;
            this.total = res.TotalRow;
            this.dataIsAvailable = this.total > 0;
          }
        },
        error: (err) => {
          console.log(err);
          this.notificationService.showError('Lỗi tìm kiếm thông tin!');
          this.dataIsAvailable = false;
        },
        complete: () => {
        }
      }
    );
  }


  // mở các dialog
  openDialog(rowData?: ExchangeRate) {
    if (rowData !== undefined) {
      if (!this.authenService.isHasPermission('exchangerate', 'EDIT')) {
        this.notificationService.showRestrictPermission();
        return;
      }
    }

    const modalRef = this.modalService.open(ExchangeratedetailComponent, {
      backdrop: 'static', scrollable: true, centered: true, backdropClass: 'backdrop-modal'
    });

    modalRef.componentInstance.bsConfig = this.bsConfig;
    modalRef.componentInstance.lstCurrency = this.lstCurrency;
    if (rowData === undefined) {
      modalRef.componentInstance.isAddState = true;
    } else {

      modalRef.componentInstance.isAddState = false;
      modalRef.componentInstance.rowSelected = Object.assign({}, rowData);
    }

    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    }, (reason) => {
    });
  }

  showConfirmDeleteDialog(rowData) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        this.deleteData(rowData);
      }
    });
  }

  deleteData(row: ExchangeRate) {
    this.service.deleteData(row).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.notificationService.showInfo('Xoá thất bại!');
        } else {
          this.notificationService.showSucess('Xoá thành công!');
          this.searchData();
        }
      } else {
        this.notificationService.showError('Lỗi xoá thông tin!');
      }
    }, err => {
      this.notificationService.showError('Lỗi xoá thông tin!');
    });
  }


  // xử lý sự kiện khi change page
  goToPage(event: number) {
    this.page = event;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  // lấy dữ liệu limit từ component paging
  changeLimit() {
    this.page = 1;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  // đi tới trang kế tiếp
  onNext() {
    this.page++;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  // đi tới trang trước đó
  onPrev() {
    this.page--;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  ngAfterViewInit(): void {
    this.searchData();
  }

  getStartRow(): number {
    const startRow = (this.page - 1) * this.pagingComponent.getLimit();
    return startRow;
  }
}
