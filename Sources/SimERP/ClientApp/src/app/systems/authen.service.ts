import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponeResult} from '../common/commomodel/ResponeResult';
import {IsCheckLogin, IsCheckRouterPermission, ROOT_URL} from '../common/config/APIURLconfig';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {User} from './user';
import {Observable} from 'rxjs/internal/Observable';
import {Key_FunctionId_View, Key_Permission, Key_UserInfo, Key_WhiteListURL} from '../common/config/globalconfig';
import {map, tap} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {CookieService} from 'ngx-cookie-service';
import sampleData from '../../data.json';
import {Permissionuser} from './permissionuser';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private readonly baseURL: string, private router: Router,
              private jwtHelperService: JwtHelperService, private  cookieService: CookieService) {
    this.baseURL = ROOT_URL;
    const userFromToken = this.extractAccessTokenData();
    this.currentUserSubject = new BehaviorSubject<User>(userFromToken);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public set currentUserValue(userInfo) {
    this.currentUserSubject.next(userInfo);
  }

  public get listPermissionValue(): Permissionuser[] {
    return this.lstPermissionSubject.value;
  }

  public set listPermissionValue(value) {
    this.lstPermissionSubject.next(value);
  }

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private lstPermissionSubject: BehaviorSubject<Permissionuser[]>;
  public lstPermission: Observable<Permissionuser[]>;

  static extractPermission(): Permissionuser[] {
    let rsl: Permissionuser[];
    rsl = JSON.parse(localStorage.getItem(Key_Permission));
    return rsl;
  }

  // kiểm tra Cookie đã có thông tin đăng nhập hay chưa
  checkLogin(): Boolean {
    if (IsCheckLogin) {
      return this.cookieService.check(Key_UserInfo);
    } else {
      return true;
    }
  }

  checkRouterPermision(controllerName: string) {
    if (!IsCheckRouterPermission) {
      return 0;
    }

    if (Key_WhiteListURL.includes(controllerName)) {
      return 0;
    }

    const FunctionId = Key_FunctionId_View;
    if (this.listPermissionValue.length > 0) {
      return this.listPermissionValue.findIndex(value => {
        return value.FunctionId.trim() === FunctionId.trim() && value.ControllerName.trim() === controllerName.trim();
      });
    } else {
      return -1;
    }
  }

  // lấy các thông tin cơ bản của user từ Cookie
  getUserInfoFromCookie(): User {
    if (IsCheckLogin) {
      let rsl = new User();
      const jsonStringUserInfo = this.cookieService.get(Key_UserInfo);
      if (jsonStringUserInfo) {
        rsl = JSON.parse(jsonStringUserInfo);
        if (rsl) {
          const permis = AuthenService.extractPermission();
          this.lstPermissionSubject = new BehaviorSubject<Permissionuser[]>(permis);
          this.lstPermission = this.lstPermissionSubject.asObservable();
          this.listPermissionValue = permis;
        }
      } else {
        rsl = null;
      }
      return rsl;
    } else {
      return sampleData;
    }
  }

  // lấy các thông tin cơ bản của user
  extractAccessTokenData(): User {
    let rsl: User;
    rsl = this.getUserInfoFromCookie();
    return rsl;
  }

  // thực hiện đăng nhập hệ thống
  login(username: string, password: string) {
    // thực hiện xoá dữ liệu hiện tại
    this.cookieService.deleteAll();
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = {'UserName': username, 'Password': password};
    // gọi api đăng nhập
    return this.httpClient.post<ResponeResult>(this.baseURL + 'api/loginsystem', JSON.stringify(body), {headers}).pipe(
      map(res => {
        if (res === undefined || res == null) {
          console.log('Lỗi kết nối tới server!');
          return;
        }
        if (!res.IsOk) {
          console.log('Không load được thông tin đăng nhập!');
          return res;
        }
        const responeResult = res as ResponeResult;
        this.cookieService.set(Key_UserInfo, JSON.stringify(responeResult.RepData[0] as User), null);
        localStorage.setItem(Key_Permission, JSON.stringify(responeResult.RepData[1] as Permissionuser[]));
        this.currentUserValue = this.extractAccessTokenData();
        return res;
      })
    );
  }

  refreshToken() {
    const body = {};
    return this.httpClient.post<ResponeResult>(this.baseURL + 'api/refreshtoken', body).pipe(
      tap((res: ResponeResult) => {
      }));
  }

  logout(): Boolean {
    try {
      const body = {};
      this.httpClient.post<ResponeResult>(this.baseURL + 'api/logout', body).pipe(
        tap(res => {
        })
      ).subscribe(res => {
        if (res && res.IsOk) {
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']).then(r => {

          });
          this.cookieService.deleteAll();
          localStorage.clear();
          return true;
        }
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  changePassword(model) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = {'userId': model.userId, 'currentPassword': model.currentPassword, 'newPassword': model.newPassword};
    return this.httpClient.post<ResponeResult>(this.baseURL + 'api/changepassword', body, {headers});
  }
}
