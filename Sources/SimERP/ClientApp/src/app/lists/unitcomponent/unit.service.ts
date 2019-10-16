import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from 'src/app/common/commomodel/ResponeResult';
import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';
import { ReqListSearch } from '../../common/commomodel/ReqListSearch';
import { ReqListDelete } from '../../common/commomodel/ReqListDelete';
import { Unit } from './model/Unit';
import { ReqListAdd } from '../../common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from '../../common/commomodel/ReqListUpdateSortOrder';
import { ROOT_URL } from '../../common/config/APIURLconfig';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  AuthenParams = new AuthenParams();
  UnitSearchParams = new ReqListSearch();
  DelUnitParams = new ReqListDelete();
  InsertUnitParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

  getData(searchString?: string, startRow?: number, maxRow?: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    this.UnitSearchParams.AuthenParams = this.AuthenParams;
    this.UnitSearchParams.MaxRow = maxRow;
    this.UnitSearchParams.StartRow = startRow;
    this.UnitSearchParams.SearchString = searchString;

    const jsonString = JSON.stringify(this.UnitSearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/unit', jsonString, { headers });
  }

  DeleteUnit(UnitCode: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.DelUnitParams.AuthenParams = this.AuthenParams;
    this.DelUnitParams.ID = UnitCode;
    const jsonString = JSON.stringify(this.DelUnitParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/DeleteUnit', jsonString, { headers });
  }

  InsertUnit(objUnit: Unit, isNew: boolean) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.InsertUnitParams.AuthenParams = this.AuthenParams;
    this.InsertUnitParams.RowData = objUnit;
    this.InsertUnitParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertUnitParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/saveunit', jsonString, { headers });
  }

  SortUnit(UpID: number, DowID: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.ReqListUpdateSortOrder.AuthenParams = this.AuthenParams;
    this.ReqListUpdateSortOrder.UpID = UpID;
    this.ReqListUpdateSortOrder.DownID = DowID;

    const jsonString = JSON.stringify(this.ReqListUpdateSortOrder);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/updateSortOrderUnit', jsonString, { headers });
  }
}
