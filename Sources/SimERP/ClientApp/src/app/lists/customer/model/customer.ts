import { Attachfile } from '../../product/model/attachfile';
import { CustomerProduct } from './customerproduct';
import { CustomerSale } from './customersale';
import { CustomerCommission } from './customercommission';
import { CustomerDelivery } from './customerdelivery';

export class Customer {
    CustomerId: any;
    CustomerCode: string = "";
    CustomerName: string = "";
    Address: string;
    PhoneNumber: string;
    FaxNumber: string;
    Email: string;
    GroupCompanyId: number;
    CustomerTypeId: number;
    CustomerTypeList: string;
    PaymentTermId: number;
    DebtCeiling: number;
    TaxNumber: string;
    CompanyName: string;
    CompanyAddress: string;
    BankingNumber: string;
    BankingName: string;
    Notes: string;
    RepresentativeName: string;
    RepresentativePhone: string;
    RepresentativeAddress: string;
    RepresentativeEmail: string;
    CreatedBy: number;
    CreateName: string = "";
    CreatedDate: Date;
    ModifyBy: number;
    ModifyDate: Date;
    CountryId: string;
    ProvinceId: number;
    DistrictId: number;
    WardId: number;
    Latitude: number;
    Longitude: number;
    SearchString: string;
    TrackingNotes: any;
    IsGroupCompany: boolean;
    IsCompany: boolean;
    IsActive: boolean = true;
    SortOrder: number;
    //tab hàng hóa
    objProduct: CustomerProduct[] = [];
    //tab saler
    objSaler: CustomerSale[] = [];
    //tab commission
    objCommission: CustomerCommission[] = [];
    //tab delivery
    objDelivery: CustomerDelivery[] = [];
    //tab file đính kèm
    ListAttachFile: Attachfile[] = [];
    ListAttachFileDelete: Attachfile[] = [];
}
