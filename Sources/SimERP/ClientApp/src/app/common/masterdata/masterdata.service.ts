import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../config/APIURLconfig';
import {AuthenParams} from '../commomodel/AuthenParams';
import {ReqListSearch} from '../commomodel/ReqListSearch';
import {ResponeResult} from '../commomodel/ResponeResult';
import {Key_MaxRow} from '../config/globalconfig';

@Injectable({
  providedIn: 'root'
})
export class MasterdataService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(apiURL: string, isActive?: boolean) {
    this.reqListSearch.MaxRow = Key_MaxRow;
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.IsActive = isActive;
    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + apiURL, jsonString, {headers});
  }

  private getCustomer(apiURL: string, isActive?: boolean) {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.StartRow = 0;
    this.reqListSearch.MaxRow = Key_MaxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.SearchString = null;
    const param = {'dataserach': this.reqListSearch, 'customertypeID': null};
    const jsonString = JSON.stringify(param);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    console.log(jsonString);
    return this.httpClient.post<ResponeResult>(this.baseUrl + apiURL, jsonString, {headers});
  }

  getCountryData() {
    return this.getData('api/list/country');
  }

  getPackageUnitData() {
    return this.getData('api/list/packageunit');
  }

  getVendorTypeData() {
    return this.getData('api/list/vendortype');
  }

  getVendorData() {
    return this.getData('api/list/vendor');
  }

  getUnitData() {
    return this.getData('api/list/unit');
  }

  getTaxData() {
    return this.getData('api/list/tax');
  }

  getProductCategoryData() {
    return this.getData('api/list/getalltproductcategory');
  }

  getPaymentTermData() {
    return this.getData('api/list/paymentterm');
  }

  getProductData() {
    return this.getData('api/list/product');
  }

  getCurrencyData() {
    return this.getData('api/list/currency', true);
  }

  getStockData() {
    return this.getData('api/list/stock', true);
  }

  getCustomerData() {
    return this.getCustomer('api/list/customer', true);
  }

  getExchangeRateLastestData() {
    return this.getData('api/list/exchangeratelastest');
  }

}
