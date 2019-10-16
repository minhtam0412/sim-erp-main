import {Inject, Injectable} from '@angular/core';
import {AuthenParams} from '../../common/commomodel/AuthenParams';
import {ReqListSearch} from '../../common/commomodel/ReqListSearch';
import {ReqListAdd} from '../../common/commomodel/ReqListAdd';
import {ReqListDelete} from '../../common/commomodel/ReqListDelete';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ROOT_URL} from '../../common/config/APIURLconfig';
import {Product} from './model/product';
import {ResponeResult} from '../../common/commomodel/ResponeResult';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  authenParams = new AuthenParams();
  reqListSearch = new ReqListSearch();
  reqListAdd = new ReqListAdd();
  reqListDelete = new ReqListDelete();
  progress: number;
  message = '';

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  getData(searchString?: string, isActive?: any, startRow?: number, maxRow?: number) {
    this.reqListSearch.AuthenParams = this.authenParams;
    this.reqListSearch.MaxRow = maxRow;
    this.reqListSearch.IsActive = isActive;
    this.reqListSearch.StartRow = startRow;
    this.reqListSearch.SearchString = searchString;
    this.reqListSearch.AddtionParams = new Map<string, any>();
    this.reqListSearch.AddtionParams['abc'] = '123';

    const jsonString = JSON.stringify(this.reqListSearch);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/product', jsonString, {headers});
  }

  saveData(product: Product, formData: FormData, isNew?: boolean) {
    this.reqListAdd.AuthenParams = this.authenParams;
    this.reqListAdd.RowData = product;
    this.reqListAdd.IsNew = isNew;
    formData.append('formData', JSON.stringify(this.reqListAdd));
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/saveproduct', formData);
  }

  getInfo(productId: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.reqListSearch.AddtionParams['ProductId'] = productId;
    return this.httpClient.post<ResponeResult>(this.baseUrl + 'api/list/getproductinfo', JSON.stringify(this.reqListSearch), {headers});
  }
}
