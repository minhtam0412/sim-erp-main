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

  getData(apiURL: string) {
    this.reqListSearch.MaxRow = Key_MaxRow;
    this.reqListSearch.AuthenParams = this.authenParams;
    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
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
}
