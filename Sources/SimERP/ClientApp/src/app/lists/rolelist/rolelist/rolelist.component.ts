import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PageList } from '../../pagelist/model/pagelist';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagelistService } from '../../pagelist/pagelist.service';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { Module } from '../../pagelist/model/Module';
import { Function } from '../../pagelist/model/Function';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';
import { RoleList } from '../model/rolelist';
import { RolelistService } from '../rolelist.service';
import { AuthenService } from 'src/app/systems/authen.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.css']
})
export class RolelistComponent implements OnInit {

  isNewModel: boolean;
  isCheckAll: boolean;
  userAuthenInfo: any;
  dataSerach: string;
  cboIsActive: number;
  cboModule: number;
  objModel: RoleList;
  dtcreate: NgbDateStruct;

  lstCboModule: Module[] = [];
  lstDataResult: RoleList[] = [];
  lstFunction: Function[] = [];
  lstPageList: PageList[] = [];

  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private rolelistService: RolelistService, private pageListService: PagelistService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService,
    private authen: AuthenService, private calendar: NgbCalendar) {

    this.objModel = new RoleList();
    this.cboIsActive = -1;
    this.dataSerach = "";
    this.cboModule = -1;
    this.dtcreate = this.calendar.getToday();

    this.userAuthenInfo = authen.extractAccessTokenData();
    this.userAuthenInfo = this.userAuthenInfo;
  }

  ngOnInit() {

    this.loadCboModule();
    this.loadListFunction();
    this.LoadPageListRole();
  }

  ngAfterViewInit(): void {

    this.SearchData();
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

  LoadPageListRole() {

    this.rolelistService.LoadPageListRole(this.objModel.ModuleId).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstPageList = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  LoadPageListRole_Edit() {

    this.rolelistService.LoadPageListRole(this.objModel.ModuleId).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstPageList = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.SetPermissionListRole(this.lstPageList, this.objModel.LstPermission);
          console.log(this.lstPageList);
        }
      }
    );
  }

  clearFunction(lstFunction: Function[]) {

  }

  //--------------Change event------------------
  SerachAction() {

    this.page = 1;
    this.LoadData(0);
  }

  ChangeCboModule() {

    this.LoadPageListRole();
  }

  GetListPermissionId() {

    var strPermissionId = "";
    this.lstPageList.forEach(element => {
      element.lstFunction.forEach(item => {
        if (item.IsCheck && item.IsRole)
          strPermissionId += item.PermissionID + ";";
      });
    });

    return strPermissionId.substr(0, strPermissionId.length - 1);
  }

  checkIssueFunctionID(lstFunction: Function[], FunctionId: string) {

    for (var i = 0; i < lstFunction.length; ++i) {
      if (lstFunction[i].IsCheck && lstFunction[i].FunctionId == FunctionId)
        return true;
    }
    return false;
  }

  checkIssuePermissionID(lst_Permissiom: string[], permissionID: number) {

    for (var i = 0; i < lst_Permissiom.length; ++i) {
      if (lst_Permissiom[i] == String(permissionID))
        return true;
    }
    return false;
  }

  CheckAllPermission() {

    this.lstPageList.forEach(element => {
      element.lstFunction.forEach(item => {
        if (item.IsCheck)
          item.IsRole = this.isCheckAll;
      });
    });
  }

  Uppercase(value) {

    this.objModel.RoleCode = String(value).toLocaleUpperCase();
  }

  SetPermissionListRole(lstPageList: PageList[], ListPermisson: string) {

    var lst_Permissiom: string[] = ListPermisson.split(';');
    lstPageList.forEach(element => {
      element.lstFunction.forEach(item => {
        if (item.IsCheck && this.checkIssuePermissionID(lst_Permissiom, item.PermissionID))
          item.IsRole = true;
      });
    });
  }

  //--------------Load data--------------------
  SearchData() {

    this.page = 1;
    this.LoadData(0);
  }

  LoadData(startRow: number) {

    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.rolelistService.getData(this.dataSerach, this.cboIsActive, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
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

  //--------------Model--------------------
  saveDataModel(isclose: boolean) {

    if(this.isNewModel)
      this.objModel.CreatedBy = this.userAuthenInfo.UserId;
    else
      this.objModel.ModifyBy = this.userAuthenInfo.UserId;

    this.objModel.LstPermission = this.GetListPermissionId();

    this.rolelistService.Insert(this.objModel, this.isNewModel).subscribe(res => {
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

    this.clearModel();
    this.isNewModel = true;
    this.objModel.CreatedName = this.userAuthenInfo.FullName;
  }

  EditModel(index: number) {

    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];

    let date_tem = new Date(this.objModel.CreatedDate.toString());

    this.dtcreate.year = date_tem.getFullYear();
    this.dtcreate.month = date_tem.getMonth();
    this.dtcreate.day = date_tem.getDay();
    this.objModel.ModuleId = this.objModel.ModuleId == null ? -1 : this.objModel.ModuleId;
    this.LoadPageListRole_Edit();
  }

  clearModel() {

    this.objModel = new RoleList();

    this.lstPageList.forEach(element => {
      element.lstFunction.forEach(item => {
        item.IsRole = false;
      });
    });
  }

  CloseModel() {

    this.clearModel();
  }

  

  checkValidateModel() {

    if (this.objModel.RoleCode.length <= 0 || this.objModel.RoleName.length <= 0)
      return true;
    return false;
  }

  //--------------Grid--------------------
  openDialog(ID: number) {

    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteRowGird(ID);
      }
    });
  }
  
  deleteRowGird(ID: number) {

    this.rolelistService.Delete(ID).subscribe(res => {
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
    var objcusr: number = this.lstDataResult[index].RoleId;
    var objUp: number = this.lstDataResult[index - 1].RoleId;

    this.rolelistService.Sort(objcusr, objUp).subscribe(res => {
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

    var objcusr: number = this.lstDataResult[index].RoleId;
    var objDow: number = this.lstDataResult[index + 1].RoleId;

    this.rolelistService.Sort(objDow, objcusr).subscribe(res => {
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

  //--------------Paging--------------------
  getStartRow(): number {
    const startRow = (this.page - 1) * this.pagingComponent.getLimit();
    return startRow;
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
