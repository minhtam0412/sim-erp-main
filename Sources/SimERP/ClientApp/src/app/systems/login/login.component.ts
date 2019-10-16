import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenService } from '../authen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string;
  model: any = { 'username': 'tam.ngominh', 'password': '1' };
  @Output() loginEvent = new EventEmitter<Boolean>();
  returnUrl: string;

  constructor(private loginService: AuthenService, private router: Router, private toastr: ToastrService,
    private loadingSpinnerService: Ng4LoadingSpinnerService, private route: ActivatedRoute) {
    // nếu người dùng đã đăng nhập thì chuyển về trang chủ
    const userInfo = this.loginService.currentUserValue;
    if (userInfo !== undefined && userInfo !== null && userInfo.UserName !== '') {
      this.router.navigate(['/']).then(res => {
      });
    }
  }

  ngOnInit() {
    // lấy url mà người dùng cần truy cập, để sau khi đăng nhập xong, redirect về trang cần truy cập
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password).pipe(first()).subscribe(data => {
      this.loading = false;
      if (data === undefined || !data.IsOk) {
        this.error = data === undefined ? 'Lỗi thực hiện đăng nhập! Vui lòng liên hệ quản trị hệ thống!' : data.MessageText;
      } else {
        // lấy thông tin user từ cookie
        const userInfoFromCookie = this.loginService.getUserInfoFromCookie();
        if (userInfoFromCookie) {
          // nếu là lần đầu đăng nhập thì chuyển hướng về trang đổi mật khẩu
          if (userInfoFromCookie.IsFirstChangePassword) {
            this.router.navigate(['/firstchangepassword']).then(res => {
            });
          } else {
            // kiểm tra nếu trang định chuyển đến là trang chủ
            // kiểm tra tiếp xem nếu user có thiết lập page default thì chuyển đến page default luôn
            if (this.returnUrl === '/' && userInfoFromCookie.PageDefault !== undefined
              && userInfoFromCookie.PageDefault != null && userInfoFromCookie.PageDefault.length > 0) {
              // nếu có thì thực hiện chuyển sang page default
              this.router.navigate([userInfoFromCookie.PageDefault]).then(res => {
              });
            } else {
              // thực hiện chuyển vể trang mặc định hoặc theo returnUrl
              this.router.navigate([this.returnUrl]).then(res => {
              });
            }
          }
        }
      }
    }, error => {
      console.log(error);
      this.error = 'Lỗi đăng nhập hệ thống! Vui lòng liên hệ admin!';
      this.loadingSpinnerService.hide();
      this.loading = false;
    });
  }
}
