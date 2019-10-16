import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerType } from '../../customertypecomponent/models/customertype';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { CustomerService } from '../customer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ComfirmDialogComponent } from 'src/app/common/comfirm-dialog/comfirm-dialog.component';
import { CustomertypeService } from '../../customertypecomponent/customertype.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  dataSerach: string;
  cboIsActive: number;
  cboCustomerType: number;
  lstCustomerType: CustomerType[] = [];
  lstDataResult: Customer[] = [];
  objModel: Customer;
  isNewModel: boolean;


  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;
  constructor(private customerService: CustomerService, private customertypeService: CustomertypeService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService) { 
    this.objModel = new Customer();
    this.cboIsActive = -1;
    this.dataSerach = "";
    this.cboCustomerType = -1;
  }

  ngOnInit() {
    this.loadCustomerType();
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
  loadCustomerType() {
    this.customertypeService.getData().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstCustomerType = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  //----------------------------------
  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.customerService.getData(this.dataSerach, this.cboCustomerType, this.cboIsActive,  startRow, limit).subscribe(
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
    this.customerService.Insert(this.objModel, this.isNewModel).subscribe(res => {
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
    this.objModel = new Customer();
  }

  CloseModel() {
    this.clearModel();
  }

  openDialog(Id: number) {
     const modalRef = this.modalService.open(ComfirmDialogComponent, {
       backdrop: false, scrollable: true, centered: true
     });
     // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
     modalRef.result.then((result) => {
       if (result != undefined && result == true) {
         this.deleteRowGird(Id);
       }
     });
  }

  deleteRowGird(Id: number) {

    this.customerService.Delete(Id).subscribe(res => {
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
    if (this.objModel.CustomerName.length <= 0 || this.objModel.CustomerCode.length <= 0)
      return true;
    return false;
  }

  actionUp(index: number) {
    if (index == 0) return;
    var objcusr: number = this.lstDataResult[index].CustomerId;
    var objUp: number = this.lstDataResult[index - 1].CustomerId;

    this.customerService.Sort(objcusr, objUp).subscribe(res => {
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

    var objcusr: number = this.lstDataResult[index].CustomerId;
    var objDow: number = this.lstDataResult[index + 1].CustomerId;

    this.customerService.Sort(objDow, objcusr).subscribe(res => {
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
