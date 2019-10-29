import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {ReqListUpdateSortOrder} from '../../common/commomodel/ReqListUpdateSortOrder';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {Stock} from './model/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

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
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/stock', jsonString, {headers});
  }

  deleteData(rowData: Stock) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = rowData.StockId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletestock', jsonString, {headers});
  }

  saveData(rowData: Stock, isNew: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = rowData;
    this.reqListAdd.IsNew = isNew;
    const jsonString = JSON.stringify(this.reqListAdd);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savestock', jsonString, {headers});
  }

  updateSortOrder(upID: number, downID: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListUpdateSortOrder.AuthenParams = this.authenParams;
    this.reqListUpdateSortOrder.UpID = upID;
    this.reqListUpdateSortOrder.DownID = downID;
    const jsonString = this.reqListUpdateSortOrder;
    return this.httpClient.post<ResponeResult>(this.baseUrl + '/api/list/updateSortOrderStock', jsonString, {headers});
  }
}
