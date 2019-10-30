import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {ReqListUpdateSortOrder} from '../../common/commomodel/ReqListUpdateSortOrder';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {Stock} from '../stock/model/stock';
import {Currency} from './model/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();
  reqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, isActive?: any, startRow?: number, maxRow?: number) {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/currency', jsonString, {headers});
  }

  deleteData(rowData: Currency) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = rowData.CurrencyId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletecurrency', jsonString, {headers});
  }

  saveData(rowData: Currency, isNew: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = rowData;
    this.reqListAdd.IsNew = isNew;
    const jsonString = JSON.stringify(this.reqListAdd);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savecurrency', jsonString, {headers});
  }

  updateSortOrder(upID: string, downID: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListUpdateSortOrder.AuthenParams = this.authenParams;
    this.reqListUpdateSortOrder.UpID = upID;
    this.reqListUpdateSortOrder.DownID = downID;
    const jsonString = this.reqListUpdateSortOrder;
    return this.httpClient.post<ResponeResult>(this.baseUrl + '/api/list/updateSortOrdercurrency', jsonString, {headers});
  }
}
