import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {ResponeResult} from '../../common/commomodel/ResponeResult';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {Vendor} from './model/vendor';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, isActive?: any, vendorTypeId?: any, startRow?: number, maxRow?: number) {
    this.reqListSearch = new ReqListSearch();
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;
    this.reqListSearch.AddtionParams = new Map<string, any>();
    this.reqListSearch.AddtionParams['vendorTypeId'] = vendorTypeId;

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/vendor', jsonString, {headers});
  }

  saveData(vendor: Vendor, formData: FormData, isNew?: boolean) {
    this.reqListAdd = new ReqListAdd();
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = vendor;
    this.reqListAdd.IsNew = isNew;
    formData.append('formData', JSON.stringify(this.reqListAdd));
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/savevendor', formData);
  }

  getInfo(vendorId: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListSearch = new ReqListSearch();
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.IsActive = true;
    this.reqListSearch.StartRow = 0;
    this.reqListSearch.MaxRow = 10;
    this.reqListSearch.SearchString = '';
    this.reqListSearch.AddtionParams = new Map<string, any>();
    this.reqListSearch.AddtionParams['VendorId'] = vendorId;
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/getvendorinfo', JSON.stringify(this.reqListSearch), {headers});
  }

  delete(row: Vendor) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListDelete.AuthenParams = this.authenParams;
    this.reqListDelete.ID = row.VendorId;
    const jsonString = JSON.stringify(this.reqListDelete);
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/deletevendor', jsonString, {headers});
  }
}
