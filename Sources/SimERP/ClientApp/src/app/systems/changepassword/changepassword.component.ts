import {Component, OnInit} from '@angular/core';
import {AuthenService} from '../authen.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../user';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  model = {'userId': 0, 'currentPassword': '', 'newPassword': '', 'confirmPassword': ''};
  currentUser: User;

  constructor(private authenService: AuthenService, private toastr: ToastrService, private router: Router,
              private activeModal: NgbActiveModal) {
    this.authenService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

  closeDialog() {
    this.activeModal.close(false);
  }

  validateData(): Boolean {
    // validate pass cũ & pass mới phải khác nhau
    if (this.model.currentPassword.length > 0 && this.model.newPassword.length > 0) {
      if (this.model.currentPassword === this.model.newPassword) {
        this.toastr.info('Mật khẩu mới không được trùng trùng với mật khẩu cũ!', 'Thông báo');
        return false;
      }
    }
    if (!this.validateRepeatPassword()) {
      return false;
    }
    return true;
  }

  validateRepeatPassword(): Boolean {
    if (this.model.newPassword.length !== undefined && this.model.newPassword.length > 0 && this.model.confirmPassword.length !== undefined
      && this.model.confirmPassword.length > 0) {
      if (this.model.newPassword !== this.model.confirmPassword) {
        return false;
      }
    }
    return true;
  }

  saveData() {
    if (!this.validateData()) {
      return;
    }
    const userInfo = this.authenService.extractAccessTokenData();
    if (userInfo !== undefined && userInfo != null) {
      this.model.userId = this.currentUser.UserId;
      this.authenService.changePassword(this.model).subscribe(res => {
        if (res.IsOk) {
          if (Boolean(res.RepData)) {
            this.toastr.success('Đổi mật khẩu thành công!');
            this.activeModal.close(true);
            this.authenService.logout();
          }
        } else {
          this.toastr.error(res.MessageText);
        }
      }, error => {
        this.toastr.error(error.message);
      });
    }
  }
}
