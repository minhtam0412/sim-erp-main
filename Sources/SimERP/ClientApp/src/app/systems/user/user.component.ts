import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../user';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ComfirmDialogComponent } from 'src/app/common/comfirm-dialog/comfirm-dialog.component';
import { UserService } from '../user.service';
import { AuthenService } from '../authen.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  dataSerach: string;
  lstDataResult: User[] = [];
  objModel: User;
  userAuthenInfo: any;
  reviewPassword: string = "";
  IsSecondPassword: boolean;
  isNewModel: boolean;
  cboIsActive: number;
  dtcreate: NgbDateStruct;
  temGender: string = "1";
  temCreateBy: string = "";

  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private UserService: UserService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService, private calendar: NgbCalendar,
    private authen: AuthenService) {

    this.dataSerach = "";
    this.objModel = new User();
    this.userAuthenInfo = authen.extractAccessTokenData();
    this.userAuthenInfo = this.userAuthenInfo;
    this.cboIsActive = -1;

  }

  ngOnInit() {
  }

  SerachAction() {
    this.page = 1;
    this.LoadData(0);
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.UserService.getData(this.dataSerach, this.cboIsActive, startRow, limit).subscribe(
       {
         next: (res) => {
           if (!res.IsOk) {
             alert('Lỗi ' + res.MessageText);;
           } else {
             this.lstDataResult = res.RepData;
             this.total = res.TotalRow;
             console.log(this.lstDataResult);
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

  confirmDelete(UserID: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteRowGird_User(UserID);
      }
    });
  }

  confirmResetPass(UserID: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    modalRef.componentInstance.contentMessage = "Bạn có muốn thiết lập lại mật khẩu mặc định ?";
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.resetPass_User(UserID);
      }
    });
  }

  deleteRowGird_User(UserID: number) {

    this.UserService.DeleteUser(UserID).subscribe(res => {
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

  resetPass_User(UserID: number) {

    this.UserService.ResetPassUser(UserID).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.toastr.warning('Mật khẩu đã được thiết lập mặc định!', 'Thông báo!');
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
    if (this.isNewModel && (this.objModel.Password != this.reviewPassword)) {
      this.toastr.warning('Mật khẩu xác nhận không chính xác!', 'Thông báo!');
      return;
    }

    this.objModel.Gender = parseInt(this.temGender);
    this.UserService.InsertUser(this.objModel, this.isNewModel).subscribe(res => {
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
    this.objModel = new User();
  }

  AddModel() {
    this.isNewModel = true;
    this.IsSecondPassword = false;
    this.dtcreate = this.calendar.getToday();
    this.objModel.CreatedBy = 1;
    this.objModel.CreatedBy = this.userAuthenInfo.UserId;
    this.objModel.Gender = parseInt(this.temGender);
    this.temCreateBy = this.userAuthenInfo.UserName;
    this.clearModel();
  }

  EditModel(index: number) {
    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];
    this.temGender = this.objModel.Gender.toString();
    this.temCreateBy = this.objModel.CreatedBy.toString();
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
