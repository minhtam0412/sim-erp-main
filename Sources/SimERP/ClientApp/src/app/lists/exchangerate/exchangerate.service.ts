import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {ReqListUpdateSortOrder} from '../../common/commomodel/ReqListUpdateSortOrder';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {ExchangeRate} from './model/exchangerate';

@Injectable({
  providedIn: 'root'
})
export class ExchangerateService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();
  reqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, isActive?: any, startRow?: number, maxRow?: number, fromDate?: Date, toData?: Date) {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;
    this.reqListSearch.AddtionParams = new Map<string, any>();

    this.reqListSearch.AddtionParams['FromDate'] = fromDate;
    this.reqListSearch.AddtionParams['ToDate'] = toData;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/exchangerate', jsonString, {headers});
  }

  deleteData(rowData: ExchangeRate) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = rowData.ExchangeRateId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deleteexchangerate', jsonString, {headers});
  }

  saveData(rowData: ExchangeRate, isNew: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = rowData;
    this.reqListAdd.IsNew = isNew;
    const jsonString = JSON.stringify(this.reqListAdd);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/saveexchangerate', jsonString, {headers});
  }

}
