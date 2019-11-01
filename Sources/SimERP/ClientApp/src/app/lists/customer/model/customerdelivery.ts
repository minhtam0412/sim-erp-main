export class CustomerDelivery {
    RowId: number;
    DeliveryPlace: string = "";
    DeliveryAddress: string = "";
    Notes: string;
    CountryId: string;
    ProvinceId?: number;
    DistrictId?: number;
    WardId?: number;
    Latitude?: number;
    Longitude?: number;
    CustomerId: number;
    GroupCompanyId?: number
    CreatedDate?: Date;
    CreatedBy?: number
    ModifyDate: Date;
    ModifyBy?: number;
    IsActive?: boolean = true;
}