import { Injectable } from '@angular/core';
import { AuthenParams } from '../../common/commomodel/AuthenParams';
import { ReqListSearch } from '../../common/commomodel/ReqListSearch';
import { ReqListDelete } from '../../common/commomodel/ReqListDelete';
import { ReqListAdd } from '../../common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from '../../common/commomodel/ReqListUpdateSortOrder';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from '../../common/commomodel/ResponeResult';
import { ROOT_URL } from '../../common/config/APIURLconfig';
import { UserRoleList } from './model/userpermission';


@Injectable({
  providedIn: 'root'
})
export class UserpermissionService {

  AuthenParams = new AuthenParams();
  SearchParams = new ReqListSearch();
  DelParams = new ReqListDelete();
  InsertParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

  getListUser() {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;
    const jsonString = JSON.stringify(this.SearchParams);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/getlistuser', jsonString, { headers });

  }

  getRoleUser( userID?: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;
    this.SearchParams.SearchString = userID == null ? null : userID.toString();
    const jsonString = JSON.stringify(this.SearchParams);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/getroleuser', jsonString, { headers });

  }

  getRoleList( userID?: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.SearchParams.AuthenParams = this.AuthenParams;
    this.SearchParams.SearchString = userID == null ? null : userID.toString();
    const jsonString = JSON.stringify(this.SearchParams);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/getrolelist', jsonString, { headers });

  }

  Insert(obj: UserRoleList[], LstPermission:string, UserId: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.InsertParams.AuthenParams = this.AuthenParams;
    this.InsertParams.RowData = obj;

    var param = { "datasave": this.InsertParams, "lstpermission": LstPermission, "userid": UserId };
    const jsonString = JSON.stringify(param);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/saveuserrole', jsonString, { headers });
  }

  LoadPageListRole( moduleID?: number, userID?: number) {

    var par_moduleID = moduleID == -1 ? null : moduleID;

    var param = { "moduleID": par_moduleID, "userID": userID };
    const jsonString = JSON.stringify(param);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/loadpagelistrole', jsonString, { headers });
  }
}
