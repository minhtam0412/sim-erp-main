import { Injectable } from '@angular/core';
import { AuthenParams } from '../../common/commomodel/AuthenParams';
import { ReqListSearch } from '../../common/commomodel/ReqListSearch';
import { ReqListDelete } from '../../common/commomodel/ReqListDelete';
import { ReqListAdd } from '../../common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from '../../common/commomodel/ReqListUpdateSortOrder';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from '../../common/commomodel/ResponeResult';
import { ROOT_URL } from '../../common/config/APIURLconfig';
import { PageList } from './model/pagelist';

@Injectable({
  providedIn: 'root'
})
export class PagelistService {

  AuthenParams = new AuthenParams();
  PageListSearchParams = new ReqListSearch();
  DelPageListParams = new ReqListDelete();
  InsertPageListParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

  getData(searchString?: string, isActive?: number, moduleID?: number, startRow?: number, maxRow?: number) {

    var par_Isative = null;
    if (isActive == 1)
      par_Isative = true;
    if (isActive == 0)
      par_Isative = false;

    var par_moduleID = moduleID == -1 ? null : moduleID;

    this.AuthenParams.Sign = 'tai.ngo';
    this.PageListSearchParams.AuthenParams = this.AuthenParams;
    this.PageListSearchParams.MaxRow = maxRow;
    this.PageListSearchParams.StartRow = startRow;
    this.PageListSearchParams.SearchString = searchString;
    this.PageListSearchParams.IsActive = par_Isative;

    var param = { "dataserach": this.PageListSearchParams, "moduleID": par_moduleID };
    const jsonString = JSON.stringify(param);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/pagelist', jsonString, { headers });
  }

  InsertPageList(objPageList: PageList, isNew: boolean) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.InsertPageListParams.AuthenParams = this.AuthenParams;
    this.InsertPageListParams.RowData = objPageList;
    this.InsertPageListParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertPageListParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/savepagelist', jsonString, { headers });
  }

  DeletePageList(VendorID: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.DelPageListParams.AuthenParams = this.AuthenParams;
    this.DelPageListParams.ID = VendorID;
    const jsonString = JSON.stringify(this.DelPageListParams);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/deletepagelist', jsonString, { headers });
  }

  SortPageList(UpID: number, DowID: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.ReqListUpdateSortOrder.AuthenParams = this.AuthenParams;
    this.ReqListUpdateSortOrder.UpID = UpID;
    this.ReqListUpdateSortOrder.DownID = DowID;

    const jsonString = JSON.stringify(this.ReqListUpdateSortOrder);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/updateSortOrderPageList', jsonString, { headers });
  }

  GetListModule() {
    this.AuthenParams.Sign = 'tai.ngo';
    this.PageListSearchParams.AuthenParams = this.AuthenParams;

    const jsonString = JSON.stringify(this.PageListSearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/getlistmodule', jsonString, { headers });
  }

  GetListFunction() {
    this.AuthenParams.Sign = 'tai.ngo';
    this.PageListSearchParams.AuthenParams = this.AuthenParams;

    const jsonString = JSON.stringify(this.PageListSearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/getlistfunction', jsonString, { headers });
  }

}
