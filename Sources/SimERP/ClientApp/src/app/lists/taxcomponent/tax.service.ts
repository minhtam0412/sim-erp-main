import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tax } from './models/Tax';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListUpdateSortOrder} from '../../common/commomodel/ReqListUpdateSortOrder';
import {ROOT_URL} from '../../common/config/APIURLconfig';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();
  reqListUpdateSortOrder = new ReqListUpdateSortOrder();


  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, startRow?: number, maxRow?: number) {
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/tax', jsonString, { headers });
  }

  DeleteTax(tax: Tax) {
    console.log(tax);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = tax.TaxId;
    const jsonString = JSON.stringify(this.reqListDelete);
    console.log(jsonString);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletetax', jsonString, { headers });
  }

  SaveTax(tax: Tax, isNew: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = tax;
    this.reqListAdd.IsNew = isNew;
    const jsonString = this.reqListAdd;
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savetax', jsonString, { headers });
  }

  UpdateSortOrderTax(upID: number, downID: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListUpdateSortOrder.AuthenParams = this.authenParams;
    this.reqListUpdateSortOrder.UpID = upID;
    this.reqListUpdateSortOrder.DownID = downID;
    const jsonString = this.reqListUpdateSortOrder;
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/updateSortOrderTax', jsonString, { headers });
  }
}
