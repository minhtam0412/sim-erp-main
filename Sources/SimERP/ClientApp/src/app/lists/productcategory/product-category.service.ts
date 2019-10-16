import { Injectable } from '@angular/core';
import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';
import { ReqListSearch } from 'src/app/common/commomodel/ReqListSearch';
import { ReqListDelete } from 'src/app/common/commomodel/ReqListDelete';
import { ReqListAdd } from 'src/app/common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from 'src/app/common/commomodel/ReqListUpdateSortOrder';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from 'src/app/common/commomodel/ResponeResult';
import { ROOT_URL } from '../../common/config/APIURLconfig';
import { ProductCategory } from './model/ProductCategory';
import { AuthenService } from '../../systems/authen.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  userAuthenInfo: any;
  AuthenParams = new AuthenParams();
  SearchParams = new ReqListSearch();
  DelParams = new ReqListDelete();
  InsertParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient, private authen: AuthenService) {

    this.userAuthenInfo = authen.extractAccessTokenData();
    this.userAuthenInfo = this.userAuthenInfo;
  }
  
  getData(searchString?: string, isActive?: number, startRow?: number, maxRow?: number) {

    var par_Isative = null;
    if (isActive == 1)
      par_Isative = true;
    if (isActive == 0)
      par_Isative = false;

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;
    this.SearchParams.MaxRow = maxRow;
    this.SearchParams.StartRow = startRow;
    this.SearchParams.SearchString = searchString;
    this.SearchParams.IsActive = par_Isative;

    const jsonString = JSON.stringify(this.SearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/productcategory', jsonString, { headers });
  }

  getAllData() {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;

    const jsonString = JSON.stringify(this.SearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/getalltproductcategory', jsonString, { headers });
  }

  Insert(objUnit: ProductCategory, isNew: boolean) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.InsertParams.AuthenParams = this.AuthenParams;
    objUnit.CreatedBy = this.userAuthenInfo.UserId;
    this.InsertParams.RowData = objUnit;
    this.InsertParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/saveproductcategory', jsonString, { headers });
  }

  Delete(id: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.DelParams.AuthenParams = this.AuthenParams;
    this.DelParams.ID = id;

    const jsonString = JSON.stringify(this.DelParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/deleteproductcategory', jsonString, { headers });
  }

  SortOrder(UpID: any, DowID: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.ReqListUpdateSortOrder.AuthenParams = this.AuthenParams;
    this.ReqListUpdateSortOrder.UpID = UpID;
    this.ReqListUpdateSortOrder.DownID = DowID;

    const jsonString = JSON.stringify(this.ReqListUpdateSortOrder);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/updateSortOrderProductCategory', jsonString, { headers });
  }


}
