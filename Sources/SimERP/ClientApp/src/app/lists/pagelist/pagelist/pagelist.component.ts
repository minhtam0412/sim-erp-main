import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PageList } from '../model/pagelist';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagelistService } from '../pagelist.service';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Module } from '../model/Module';
import { Function } from '../model/Function';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';

@Component({
  selector: 'app-pagelist',
  templateUrl: './pagelist.component.html',
  styleUrls: ['./pagelist.component.css']
})
export class PagelistComponent implements OnInit {

  dataSerach: string;
  cboIsActive: number;
  cboModule: number;
  lstCboModule: Module[] = [];
  lstDataResult: PageList[] = [];
  lstFunction: Function[] = [];
  objModel: PageList;
  isNewModel: boolean;


  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private pageListService: PagelistService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService) {
    this.objModel = new PageList();
    this.cboIsActive = -1;
    this.dataSerach = "";
    this.cboModule = -1;
    //--------load data combo----------
    this.loadCboModule();
    this.loadListFunction();
  }

  ngOnInit() {
  }

  SerachAction() {
    this.page = 1;
    this.LoadData(0);
  }

  AddModel() {
    this.isNewModel = true;
    this.clearModel();
  }

  //----------load Combobox-----------
  loadCboModule() {
    this.pageListService.GetListModule().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstCboModule = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  loadListFunction() {
    this.pageListService.GetListFunction().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstFunction = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  clearFunction(lstFunction: Function[]) {
    lstFunction.forEach(function (item) {
      item.IsCheck = false;
    });
    return lstFunction;
  }

  //----------------------------------
  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.pageListService.getData(this.dataSerach, this.cboIsActive, this.cboModule,  startRow, limit).subscribe(
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
    this.pageListService.InsertPageList(this.objModel, this.isNewModel).subscribe(res => {
       if (res !== undefined) {
         if (!res.IsOk) {
           this.toastr.error(res.MessageText, 'Thông báo!');
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
    this.objModel = new PageList();
    this.objModel.lstFunction = this.clearFunction(this.lstFunction);
  }

  CloseModel() {
    this.clearModel();
  }

  openDialog(PageID: number) {
     const modalRef = this.modalService.open(ComfirmDialogComponent, {
       backdrop: false, scrollable: true, centered: true
     });
     // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
     modalRef.result.then((result) => {
       if (result != undefined && result == true) {
         this.deleteRowGird_PageList(PageID);
       }
     });
  }

  deleteRowGird_PageList(PageID: number) {

    this.pageListService.DeletePageList(PageID).subscribe(res => {
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

  checkValidateModel() {
    if (this.objModel.PageName.length <= 0 || this.objModel.ControllerName.length <= 0 || this.objModel.ActionName.length <= 0)
      return true;
    return false;
  }

  actionUp(index: number) {
    if (index == 0) return;
    var objcusr: number = this.lstDataResult[index].PageId;
    var objUp: number = this.lstDataResult[index - 1].PageId;

    this.pageListService.SortPageList(objcusr, objUp).subscribe(res => {
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

    var objcusr: number = this.lstDataResult[index].PageId;
    var objDow: number = this.lstDataResult[index + 1].PageId;

    this.pageListService.SortPageList(objDow, objcusr).subscribe(res => {
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
