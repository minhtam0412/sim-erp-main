import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {CustomerType} from './models/customertype';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ReqListUpdateSortOrder} from '../../common/commomodel/ReqListUpdateSortOrder';

@Injectable({
  providedIn: 'root'
})
export class CustomertypeService {
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
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/customertype', jsonString, {headers});
  }

  deleteCustomerType(cusType: CustomerType) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = cusType.CustomerTypeId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletecustomertype', jsonString, {headers});
  }

  saveCustomerType(cusType: CustomerType, isNew: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = cusType;
    this.reqListAdd.IsNew = isNew;
    const jsonString = JSON.stringify(this.reqListAdd);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savecustomertype', jsonString, {headers});
  }

  updateSortOrder(upID: number, downID: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListUpdateSortOrder.AuthenParams = this.authenParams;
    this.reqListUpdateSortOrder.UpID = upID;
    this.reqListUpdateSortOrder.DownID = downID;
    const jsonString = this.reqListUpdateSortOrder;
    return this.httpClient.post<ResponeResult>(this.baseUrl + '/api/list/updateSortOrderCustomerType', jsonString, {headers});
  }
}
