import {Component, OnInit} from '@angular/core';
import {AuthenService} from '../authen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {User} from '../user';

@Component({
  selector: 'app-firstchangepassword',
  templateUrl: './firstchangepassword.component.html',
  styleUrls: ['./firstchangepassword.component.css']
})
export class FirstchangepasswordComponent implements OnInit {
  model = {'userId': 0, 'currentPassword': '', 'newPassword': '', 'confirmPassword': ''};
  error = '';
  currentUser: User;

  constructor(private authenService: AuthenService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.authenService.currentUser.subscribe(res => this.currentUser = res);
    if (this.currentUser === undefined || this.currentUser === null || !this.currentUser.IsFirstChangePassword) {
      this.router.navigate(['/']);
    }
  }

  validateData(): Boolean {
    this.error = '';
    // validate pass cũ & pass mới phải khác nhau
    if (this.model.currentPassword.length > 0 && this.model.newPassword.length > 0) {
      if (this.model.currentPassword === this.model.newPassword) {
        this.error = 'Mật khẩu mới không được trùng trùng với mật khẩu cũ!';
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


  changePassword() {
    if (!this.validateData()) {
      return;
    }
    this.authenService.changePassword(this.model).subscribe(res => {
      if (res !== undefined) {
        if (res.IsOk && res.RepData) {
          // xử lý nếu đổi mật khẩu thành công
          // thực hiện đăng nhập bằng mật khẩu mới
          this.authenService.login(this.currentUser.UserName, this.model.newPassword).subscribe(res => {
            if (res !== undefined) {
              if (res.IsOk) {
                let URL = '';
                const userInfo = this.authenService.extractAccessTokenData();
                if (userInfo != null && userInfo.PageDefault != null) {
                  URL = userInfo.PageDefault;
                }
                this.toastr.success('Đổi mật khẩu thành công!');
                this.router.navigate([URL]).then(res => {
                });
              }
            } else {
              this.toastr.error('Lỗi đăng nhập sau khi đổi mật khẩu! Vui lòng liên hệ quản trị hệ thống!');
            }
          });
        } else {
          this.toastr.error(res.MessageText);
        }
      } else {
        this.toastr.error('Lỗi thay đổi mật khẩu! Vui lòng liên hệ quản trị hệ thống!');
      }
    });

  }

}
