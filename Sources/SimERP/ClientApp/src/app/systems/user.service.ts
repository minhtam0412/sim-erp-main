import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from 'src/app/common/commomodel/ResponeResult';
import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';
import { ReqListSearch } from '../common/commomodel/ReqListSearch';
import { ReqListDelete } from '../common/commomodel/ReqListDelete';
import { ReqListAdd } from '../common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from '../common/commomodel/ReqListUpdateSortOrder';
import { ROOT_URL } from '../common/config/APIURLconfig';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  AuthenParams = new AuthenParams();
  UserSearchParams = new ReqListSearch();
  DelUserParams = new ReqListDelete();
  InsertUserParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

  getData(searchString?: string, isActive?: number, startRow?: number, maxRow?: number) {
    var par_Isative = null;
    if (isActive == 1)
      par_Isative = true;
    if (isActive == 0)
      par_Isative = false;

    this.AuthenParams.Sign = 'tai.ngo';
    this.UserSearchParams.AuthenParams = this.AuthenParams;
    this.UserSearchParams.MaxRow = maxRow;
    this.UserSearchParams.StartRow = startRow;
    this.UserSearchParams.SearchString = searchString;
    this.UserSearchParams.IsActive = par_Isative;

    const jsonString = JSON.stringify(this.UserSearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/userdata', jsonString, { headers });
  }

  DeleteUser(UserId: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.DelUserParams.AuthenParams = this.AuthenParams;
    this.DelUserParams.ID = UserId;

    const jsonString = JSON.stringify(this.DelUserParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/deleteUser', jsonString, { headers });
  }

  InsertUser(objUser: User, isNew: boolean) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.InsertUserParams.AuthenParams = this.AuthenParams;
    this.InsertUserParams.RowData = objUser;
    this.InsertUserParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertUserParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/saveuser', jsonString, { headers });
  }

  ResetPassUser(UserId: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.DelUserParams.AuthenParams = this.AuthenParams;
    this.DelUserParams.ID = UserId;

    const jsonString = JSON.stringify(this.DelUserParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/user/resetPassUser', jsonString, { headers });
  }
  
}
