import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponeResult} from '../common/commomodel/ResponeResult';
import {ROOT_URL} from '../common/config/APIURLconfig';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseURL: string, private router: Router) {
    this.baseURL = ROOT_URL;
  }

  login(username: string, password: string) {
    localStorage.clear();
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = {'UserName': username, 'Password': password};
    return this.httpClient.post<ResponeResult>(this.baseURL + 'api/loginsystem', JSON.stringify(body), {headers});
  }

  logout(): Boolean {
    try {
      localStorage.clear();
      this.router.navigate(['/login']);
      return true;
    } catch (e) {
      return false;
    }
  }
}
