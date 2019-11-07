import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {SaleInvoice} from './model/saleorder';

@Injectable({
  providedIn: 'root'
})
export class SaleorderService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, startRow?: number, maxRow?: number, fromDate?: Date, toDate?: Date,
          voucherStatus?: number) {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = true;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;
    this.reqListSearch.AddtionParams = new Map<string, any>();

    this.reqListSearch.AddtionParams['FromDate'] = fromDate;
    this.reqListSearch.AddtionParams['ToDate'] = toDate;
    this.reqListSearch.AddtionParams['VoucherStatus'] = voucherStatus;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/saleorder', jsonString, {headers});
  }

  saveData(rowData: SaleInvoice, isNew?: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = rowData;
    this.reqListAdd.IsNew = isNew;
    const jsonString = JSON.stringify(this.reqListAdd);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savesaleorder', jsonString, {headers});
  }

  getInfo(id: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListSearch = new ReqListSearch();
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.IsActive = true;
    this.reqListSearch.StartRow = 0;
    this.reqListSearch.MaxRow = 10;
    this.reqListSearch.SearchString = String(id);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/getsaleorderinfo', JSON.stringify(this.reqListSearch), {headers});
  }

  delete(row: SaleInvoice) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = row.SaleInvoiceId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletesaleorder', jsonString, {headers});
  }

}
