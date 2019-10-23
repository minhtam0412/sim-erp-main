import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenService } from '../../authen.service';
import { User } from '../../user';
import { UserpermissionService } from '../userpermission.service';
import { UserRoleList } from '../model/userpermission';
import { Function } from 'src/app/lists/pagelist/model/Function';
import { Module } from 'src/app/lists/pagelist/model/Module';
import { PageList } from 'src/app/lists/pagelist/model/pagelist';
import { PagelistService } from 'src/app/lists/pagelist/pagelist.service';

@Component({
  selector: 'app-userpermission',
  templateUrl: './userpermission.component.html',
  styleUrls: ['./userpermission.component.css']
})
export class UserpermissionComponent implements OnInit {

  isCheckAll: boolean;
  cboUserID: number;
  cboModuleId: number;
  userAuthenInfo: any;
  LstPermission:string;

  lstCboUser: User[] = [];
  lstRoleList: UserRoleList[] = [];
  lstRoleUser: UserRoleList[] = [];

  lstCboModule: Module[] = [];
  lstFunction: Function[] = [];
  lstPageList: PageList[] = [];
  
  constructor(private userpermissionService: UserpermissionService, private pageListService: PagelistService, 
    private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService, private authen: AuthenService) {

    this.userAuthenInfo = authen.extractAccessTokenData();
    this.userAuthenInfo = this.userAuthenInfo;

    this.cboModuleId = -1;
  }

  ngOnInit() {
    
    this.loadListUser();
    this.loadCboModule();
    this.loadListFunction();
    
  }

  loadListUser() {

    this.userpermissionService.getListUser().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstCboUser = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.cboUserID = this.userAuthenInfo.UserId;
          this.ChangeCboUser();
          this.LoadPageListRole();
        }
      }
    );
  }

  LoadPageListRole() {

    this.userpermissionService.LoadPageListRole(this.cboModuleId, this.cboUserID).subscribe(
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

  addRole(){
    if(this.lstRoleList.map(x => x.isCheck).length > 0){
      this.lstRoleList.forEach(element => {
        if(element.isCheck){
          this.lstRoleUser.push(element);
        }
      });

      this.lstRoleList = this.lstRoleList.filter(obj => !obj.isCheck);
      this.lstRoleUser.map(obj => obj.isCheck = false);
      
    }
  }

  removeRole(){
    if(this.lstRoleUser.map(x => x.isCheck).length > 0){
      this.lstRoleUser.forEach(element => {
        if(element.isCheck){
          this.lstRoleList.push(element);
        }
      });

      this.lstRoleUser = this.lstRoleUser.filter(obj => !obj.isCheck);
      this.lstRoleList.map(obj => obj.isCheck = false);
      this.lstRoleList.sort(x=>x.RoleId);
    }
  }

  ChangeCboUser(){
    this.loadRoleList();
    this.loadListRoleUser();
    this.LoadPageListRole();
  }

  loadListRoleUser() {
    this.spinnerService.show();
    this.userpermissionService.getRoleUser(this.cboUserID).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstRoleUser = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.spinnerService.hide();
          console.log(this.lstRoleUser);
        }
      }
    );
  }

  loadRoleList() {
    this.spinnerService.show();
    this.userpermissionService.getRoleList(this.cboUserID).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstRoleList = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.spinnerService.hide();
          console.log(this.lstRoleList);
        }
      }
    );
  }
  
  rowClick(array: UserRoleList[], index: number){
    array[index].isCheck = !array[index].isCheck;
  }

  saveRoleUser(){
    
    this.LstPermission = this.GetListPermissionId();

    this.userpermissionService.Insert(this.lstRoleUser, this.LstPermission, this.cboUserID).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.toastr.success('Dữ liệu đã được cập nhật', 'Thông báo!');
          this.ChangeCboUser();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
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

  ChangeCboModule() {

    this.LoadPageListRole();
  }

  CheckAllPermission() {

    this.lstPageList.forEach(element => {
      element.lstFunction.forEach(item => {
        if (item.IsCheck)
          item.IsRole = this.isCheckAll;
      });
    });
  }
}
