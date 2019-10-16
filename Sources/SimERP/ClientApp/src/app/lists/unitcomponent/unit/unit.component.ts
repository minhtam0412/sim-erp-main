import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Unit } from '../model/Unit';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnitService } from '../unit.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  dataSerach: string;
  lstDataResult: Unit[] = [];
  objModel: Unit;
  isNewModel: boolean;

  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;


  constructor(private UnitService: UnitService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService) {
    this.objModel = new Unit();
  }

  ngOnInit() {
  }

  SerachAction() {
    this.page = 1;
    this.LoadData(0);
  }

  deleteRowGird_Unit(UnitCode: number) {

    this.UnitService.DeleteUnit(UnitCode).subscribe(res => {
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

  openDialog(UnitCode: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteRowGird_Unit(UnitCode);
      }
    });
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.UnitService.getData(this.dataSerach, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            alert('Lỗi ' + res.MessageText);;
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

  clearModel() {
    this.objModel = new Unit();
  }

  actionUp(index: number) {
    if (index == 0) return;
    var objcusr: number = this.lstDataResult[index].UnitId;
    var objUp: number = this.lstDataResult[index - 1].UnitId;

    this.UnitService.SortUnit(objcusr, objUp).subscribe(res => {
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

    var objcusr: number = this.lstDataResult[index].UnitId;
    var objDow: number = this.lstDataResult[index + 1].UnitId;
   
    this.UnitService.SortUnit(objDow, objcusr).subscribe(res => {
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

  saveDataModel(isclose: boolean) {
    this.UnitService.InsertUnit(this.objModel, this.isNewModel).subscribe(res => {
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

  AddModel() {
    this.isNewModel = true;
  }

  EditModel(index: number) {
    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];
    this.objModel.UnitCode = this.lstDataResult[index].UnitCode;
    this.objModel.UnitName = this.lstDataResult[index].UnitName;
    this.objModel.Notes = this.lstDataResult[index].Notes;
    this.objModel.IsActive = this.lstDataResult[index].IsActive;
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

}
