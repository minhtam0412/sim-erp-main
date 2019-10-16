import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VendorType } from '../model/vendortype';
import { VendortypeService } from '../vendortype.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';

@Component({
  selector: 'app-vendortype',
  templateUrl: './vendortype.component.html',
  styleUrls: ['./vendortype.component.css']
})
export class VendortypeComponent implements OnInit {

  dataSerach: string;
  cboIsActive: number;
  lstDataResult: VendorType[] = [];
  objModel: VendorType;
  isNewModel: boolean;

  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private vendortypeService: VendortypeService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService) {
    this.objModel = new VendorType();
    this.cboIsActive = -1;
    this.dataSerach = "";
  }

  ngOnInit() {
  }

  SerachAction() {
    this.page = 1;
    this.LoadData(0);
  }

  AddModel() {
    this.isNewModel = true;
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.vendortypeService.getData(this.dataSerach, this.cboIsActive, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstDataResult = res.RepData;
            this.total = res.TotalRow;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.spinnerService.hide();
        }
      }
    );
  }

  saveDataModel(isclose: boolean) {
    this.vendortypeService.InsertVendorType(this.objModel, this.isNewModel).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
          this.objModel.VendorTypeCode = "";
        } else {
          this.SearchData();
          this.clearModel();
          this.toastr.success(this.isNewModel ? 'Thêm dữ liệu thành công' : 'Dữ liệu đã được chỉnh sửa', 'Thông báo!');
          if (isclose) {
            this.closeAddExpenseModal.nativeElement.click();
          }
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  clearModel() {
    this.objModel = new VendorType();
  }

  CloseModel() {
    this.objModel = new VendorType();
  }

  openDialog(VendorID: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteRowGird_Vendor(VendorID);
      }
    });
  }

  deleteRowGird_Vendor(VendorID: number) {

    this.vendortypeService.DeleteVenderType(VendorID).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.toastr.warning('Dữ liệu đã được xóa', 'Thông báo!');
          this.SearchData();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  actionUp(index: number) {
    if (index == 0) return;
    var objcusr: number = this.lstDataResult[index].VendorTypeId;
    var objUp: number = this.lstDataResult[index - 1].VendorTypeId;

    this.vendortypeService.SortVendorType(objcusr, objUp).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.SearchData();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });

  }

  actionDow(index: number) {
    if (index == this.lstDataResult.length - 1) return;

    var objcusr: number = this.lstDataResult[index].VendorTypeId;
    var objDow: number = this.lstDataResult[index + 1].VendorTypeId;

    this.vendortypeService.SortVendorType(objDow, objcusr).subscribe(res => {
       if (res !== undefined) {
         if (!res.IsOk) {
           this.toastr.error(res.MessageText, 'Thông báo!');
         } else {
           this.SearchData();
         }
       } else {
         this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
       }
     }, err => {
       console.log(err);
     });

  }

  EditModel(index: number) {
    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];
    this.objModel.VendorTypeCode = this.lstDataResult[index].VendorTypeCode;
    this.objModel.VendorTypeName = this.lstDataResult[index].VendorTypeName;
    this.objModel.Notes = this.lstDataResult[index].Notes;
    this.objModel.IsActive = this.lstDataResult[index].IsActive;
  }

  SearchData() {
    this.page = 1;
    this.LoadData(0);
  }

  getStartRow(): number {
    const startRow = (this.page - 1) * this.pagingComponent.getLimit();
    return startRow;
  }

  ngAfterViewInit(): void {
    this.SearchData();
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

}
