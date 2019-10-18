import { Injectable } from '@angular/core';
import { AuthenParams } from '../../common/commomodel/AuthenParams';
import { ReqListSearch } from '../../common/commomodel/ReqListSearch';
import { ReqListDelete } from '../../common/commomodel/ReqListDelete';
import { ReqListAdd } from '../../common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from '../../common/commomodel/ReqListUpdateSortOrder';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from '../../common/commomodel/ResponeResult';
import { ROOT_URL } from '../../common/config/APIURLconfig';
import { RoleList } from './model/rolelist';

@Injectable({
  providedIn: 'root'
})
export class RolelistService {

  AuthenParams = new AuthenParams();
  SearchParams = new ReqListSearch();
  DelParams = new ReqListDelete();
  InsertParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

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
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/rolelist', jsonString, { headers });

  }

  Insert(obj: RoleList, isNew: boolean) {
    if(obj.ModuleId == -1)
      obj.ModuleId = null;

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.InsertParams.AuthenParams = this.AuthenParams;
    this.InsertParams.RowData = obj;
    this.InsertParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/saverolelist', jsonString, { headers });
  }

  Delete(Id: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.DelParams.AuthenParams = this.AuthenParams;
    this.DelParams.ID = Id;
    const jsonString = JSON.stringify(this.DelParams);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/deleterolelist', jsonString, { headers });
  }

  Sort(UpID: number, DowID: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.ReqListUpdateSortOrder.AuthenParams = this.AuthenParams;
    this.ReqListUpdateSortOrder.UpID = UpID;
    this.ReqListUpdateSortOrder.DownID = DowID;

    const jsonString = JSON.stringify(this.ReqListUpdateSortOrder);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/updateSortOrderRoleList', jsonString, { headers });
  }

  GetListModule() {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;

    const jsonString = JSON.stringify(this.SearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/getlistmodule', jsonString, { headers });
  }

  GetListFunction() {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;

    const jsonString = JSON.stringify(this.SearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/getlistfunction', jsonString, { headers });
  }

  LoadPageListRole( moduleID?: number) {

    var par_moduleID = moduleID == -1 ? null : moduleID;

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;
   
    var param = { "dataserach": this.SearchParams, "moduleID": par_moduleID };
    const jsonString = JSON.stringify(param);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/loadpagelistrole', jsonString, { headers });
  }
}
