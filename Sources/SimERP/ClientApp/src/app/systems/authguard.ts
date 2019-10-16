import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthenService} from './authen.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtHelperService: JwtHelperService, private authenService: AuthenService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // kiểm tra trong Cookie đã có thông tin user đăng nhập hay chưa
    if (this.authenService.checkLogin()) {
      // lấy thông tin user đã đăng nhập từ Cookie
      const userInfo = this.authenService.extractAccessTokenData();
      if (userInfo) {
        // kiểm tra lần đầu đăng nhập, chuyển hướng tới trang đổi mật khẩu
        if (userInfo.IsFirstChangePassword) {
          this.router.navigate(['/firstchangepassword']).then((res) => {
          });
          return false;
        } else {
          // ngược lại thực hiện điều hướng bình thường
          return true;
        }
      }
    }

    // không thoả các case trên => thực hiện điều hướng tới trang đăng nhập
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then(r => {
    });
    return false;
  }
}
