import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ROOT_URL} from '../../common/config/APIURLconfig';

@Injectable({
  providedIn: 'root'
})
export class CustomserviceService {
  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();

  constructor(@Inject('BASE_URL') private baseUrl: string, private httpClient: HttpClient) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, isActive?: any, startRow?: number, maxRow?: number): Observable<ResponeResult> {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/customertype', jsonString, {headers});
  }
}
