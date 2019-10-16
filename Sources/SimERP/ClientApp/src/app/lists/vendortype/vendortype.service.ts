import { Injectable } from '@angular/core';
import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';
import { ReqListSearch } from 'src/app/common/commomodel/ReqListSearch';
import { ReqListDelete } from 'src/app/common/commomodel/ReqListDelete';
import { ReqListAdd } from 'src/app/common/commomodel/ReqListAdd';
import { ReqListUpdateSortOrder } from 'src/app/common/commomodel/ReqListUpdateSortOrder';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponeResult } from 'src/app/common/commomodel/ResponeResult';
import { ROOT_URL } from '../../common/config/APIURLconfig';
import { VendorType } from './model/vendortype';

@Injectable({
  providedIn: 'root'
})
export class VendortypeService {

  AuthenParams = new AuthenParams();
  VendorTypeSearchParams = new ReqListSearch();
  DelVendorTypeParams = new ReqListDelete();
  InsertVendorTypeParams = new ReqListAdd();
  ReqListUpdateSortOrder = new ReqListUpdateSortOrder();

  constructor(private httpClient: HttpClient) { }

  getData(searchString?: string, isActive?: number, startRow?: number, maxRow?: number) {

    var par_Isative = null;
    if (isActive == 1)
      par_Isative = true;
    if (isActive == 0)
      par_Isative = false;

    this.AuthenParams.Sign = 'tai.ngo';
    this.VendorTypeSearchParams.AuthenParams = this.AuthenParams;
    this.VendorTypeSearchParams.MaxRow = maxRow;
    this.VendorTypeSearchParams.StartRow = startRow;
    this.VendorTypeSearchParams.SearchString = searchString;
    this.VendorTypeSearchParams.IsActive = par_Isative;

    const jsonString = JSON.stringify(this.VendorTypeSearchParams);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.httpClient.post<ResponeResult>( ROOT_URL +  'api/list/vendortype', jsonString, { headers });
  }

  InsertVendorType(objUnit: VendorType, isNew: boolean) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.InsertVendorTypeParams.AuthenParams = this.AuthenParams;
    this.InsertVendorTypeParams.RowData = objUnit;
    this.InsertVendorTypeParams.IsNew = isNew;

    const jsonString = JSON.stringify(this.InsertVendorTypeParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/savevendortype', jsonString, { headers });
  }

  DeleteVenderType(VendorID: any) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.DelVendorTypeParams.AuthenParams = this.AuthenParams;
    this.DelVendorTypeParams.ID = VendorID;
    const jsonString = JSON.stringify(this.DelVendorTypeParams);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/deletevendortype', jsonString, { headers });
  }

  SortVendorType(UpID: number, DowID: number) {

    this.AuthenParams.Sign = 'tai.ngo';
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.ReqListUpdateSortOrder.AuthenParams = this.AuthenParams;
    this.ReqListUpdateSortOrder.UpID = UpID;
    this.ReqListUpdateSortOrder.DownID = DowID;

    const jsonString = JSON.stringify(this.ReqListUpdateSortOrder);
    return this.httpClient.post<ResponeResult>(ROOT_URL + 'api/list/updateSortOrderVendorType', jsonString, { headers });
  }
}
