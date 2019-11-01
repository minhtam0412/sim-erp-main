import { Guid } from 'guid-typescript';

export class CustomerProduct {
    RowId: number;
    CustomerId: number;
    ProductId: number;
    ProductCode: string;
    ProductName: string = "";
    SaleId: number;
    SaleName: string = "";
    Price: number;
    UnitName: string = "";
    ProductCategoryId: Guid = null;
    ProductCategoryName: string = "";
    ProductType: number;
    Notes: string;
    IsActive: boolean = true;
    IsSale:boolean = false;
}