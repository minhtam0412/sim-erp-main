import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TaxService } from '../tax.service';
import { Tax } from '../models/Tax';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxinfoComponent } from '../taxinfo/taxinfo.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';
import { AuthenService } from '../../../systems/authen.service';
import { User } from '../../../systems/user';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaxComponent implements OnInit, AfterViewInit {

  formSearch: FormGroup;
  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  lstDataResult: Tax[];
  loading = false;
  total = 10;
  page = 1;
  limit = 10;
  isDataAvailable = false;

  public autocompleteHeaderTemplate = `
  <div class="header-row">
  <div class="col-3">Mã thuế</div>
  <div class="col-3">Tên thuế</div>
  </div>`;

  private sessionUser: User;

  constructor(private taxService: TaxService, private modalService: NgbModal, private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService, private authenService: AuthenService) {
    this.authenService.currentUser.subscribe(x => {
      this.sessionUser = x;
    });
  }

  public renderDataRowAutoComplete(data: Tax): string {
    const html = `
      <div class="data-row">
        <div class="col-3">${data.TaxCode}</div>
        <div class="col-3">${data.TaxName}</div>
      </div>`;
    return html;
  }

  ngOnInit() {
    this.formSearch = new FormGroup({
      SearchString: new FormControl(),
    });
  }

  getStartRow(): number {
    const startRow = (this.page - 1) * this.pagingComponent.getLimit();
    return startRow;
  }

  ngAfterViewInit(): void {
    this.SearchData();
  }

  SearchData() {
    this.page = 1;
    this.LoadData(0);
  }

  goToPage(n: number): void {
    this.page = n;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  changeLimit() {
    this.page = 1;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  onNext(): void {
    this.page++;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  onPrev(): void {
    this.page--;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.taxService.getData(this.formSearch.getRawValue().SearchString, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText);
            this.lstDataResult = [];
            this.total = 0;
            this.isDataAvailable = false;
          } else {
            this.lstDataResult = res.RepData;
            this.total = res.TotalRow;
            this.isDataAvailable = this.total > 0 ? true : false;
          }
        },
        error: (err) => {
          this.toastr.error('Lỗi tìm kiếm thông tin!');
          this.isDataAvailable = false;
        },
        complete: () => {
          this.spinnerService.hide();
        }
      }
    );
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.SearchData();
    }
  }

  deleteTax(taxData) {
    this.taxService.DeleteTax(taxData).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.info('Xoá thất bại!');
        } else {
          this.toastr.success('Xoá thành công!');
          this.SearchData();
        }
      } else {
        this.toastr.error('Lỗi xoá thông tin!');
      }
    }, err => {
      this.toastr.error('Lỗi xoá thông tin!');
    });
  }

  openDialog(rowSelected?: any) {
    const modalRef = this.modalService.open(TaxinfoComponent, {
      backdrop: 'static', scrollable: true, centered: true, backdropClass: 'backdrop-modal'
    });

    if (rowSelected === undefined) {
      modalRef.componentInstance.isAddState = true;
    } else {
      modalRef.componentInstance.rowSelected = rowSelected;
      modalRef.componentInstance.isAddState = false;
    }

    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    }, (reason) => {

    });
  }

  autocompleteCallback(event) {
    console.log(event);
  }

  showConfirmDeleteDialog(taxData) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteTax(taxData);
      }
    });
  }

  moveUp(index) {
    console.log('moveUp');
    const upID = this.lstDataResult[index].TaxId;
    const downID = this.lstDataResult[index - 1].TaxId;
    this.taxService.UpdateSortOrderTax(upID, downID).subscribe(res => {
      if (res == undefined || !res.IsOk) {
        this.toastr.error('Lỗi cập nhật Sort Order!');
      } else {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    });
  }

  moveDown(index) {
    console.log('moveDown');
    const downID = this.lstDataResult[index].TaxId;
    const upID = this.lstDataResult[index + 1].TaxId;
    this.taxService.UpdateSortOrderTax(upID, downID).subscribe(res => {
      if (res == undefined || !res.IsOk) {
        this.toastr.error('Lỗi cập nhật Sort Order!');
      } else {
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    });
  }
}
