import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PaginationComponent} from '../../../pagination/pagination.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ToastrService} from 'ngx-toastr';
import {AuthenService} from '../../../systems/authen.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {Currency} from '../model/currency';
import {CurrencyService} from '../currency.service';
import {CurrencydetailComponent} from '../currencydetail/currencydetail.component';
import {ListStatus} from '../../../common/masterdata/commondata';

@Component({
  selector: 'app-currencylist',
  templateUrl: './currencylist.component.html',
  styleUrls: ['./currencylist.component.css']
})
export class CurrencylistComponent implements OnInit, AfterViewInit {

  dataIsAvailable: boolean; // xác định có data trả về khi tìm kiếm
  lstDataResult: Currency[] = []; // danh sách CustomerType
  page = 1; // chỉ số trang hiện tại
  limit = 10; // số record cần hiển thị trên 1 trang
  total = 10; // tổng số record trả về
  searchString: string; // binding textbox
  isActive = -1; // binding combo Trạng thái

  @ViewChild(PaginationComponent, {static: false}) pagingComponent: PaginationComponent;
  lstStatus = ListStatus;

  constructor(private modalService: NgbModal, private service: CurrencyService, private spinnerService: Ng4LoadingSpinnerService,
              private toastr: ToastrService, private authenService: AuthenService, private notificationService: NotificationService) {
  }

  ngOnInit() {

  }

  // tìm kiếm dữ liệu
  searchData() {
    this.page = 1;
    this.LoadData(0);
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.service.getData(this.searchString, Number(this.isActive) === -1 ? null : Number(this.isActive), startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText);
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
          this.toastr.error('Lỗi tìm kiếm thông tin!');
          this.dataIsAvailable = false;
        },
        complete: () => {
          this.spinnerService.hide();
        }
      }
    );
  }


  // mở các dialog
  openDialog(rowData?: Currency) {
    if (rowData !== undefined) {
      if (!this.authenService.isHasPermission('currency', 'EDIT')) {
        this.notificationService.showRestrictPermission();
        return;
      }
    }

    const modalRef = this.modalService.open(CurrencydetailComponent, {
      backdrop: 'static', scrollable: true, centered: true, backdropClass: 'backdrop-modal'
    });

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

  showConfirmDeleteDialog(cusType) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        this.deleteData(cusType);
      }
    });
  }

  deleteData(row: Currency) {
    this.service.deleteData(row).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.info('Xoá thất bại!');
        } else {
          this.toastr.success('Xoá thành công!');
          this.searchData();
        }
      } else {
        this.toastr.error('Lỗi xoá thông tin!');
      }
    }, err => {
      this.toastr.error('Lỗi xoá thông tin!');
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

  moveUp(index: number) {
    const upID = this.lstDataResult[index].CurrencyId;
    const downID = this.lstDataResult[index - 1].CurrencyId;
    this.service.updateSortOrder(upID, downID).subscribe(res => {
      if (res === undefined || !res.IsOk) {
        this.toastr.error('Lỗi cập nhật Sort Order!');
      } else {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    });
  }

  moveDown(index: number) {
    const downID = this.lstDataResult[index].CurrencyId;
    const upID = this.lstDataResult[index + 1].CurrencyId;
    this.service.updateSortOrder(upID, downID).subscribe(res => {
      if (res === undefined || !res.IsOk) {
        this.toastr.error('Lỗi cập nhật Sort Order!');
      } else {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    });
  }


  clearIsActive() {
    this.isActive = -1;
  }
}
