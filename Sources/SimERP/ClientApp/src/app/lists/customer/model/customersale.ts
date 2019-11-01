
export class CustomerSale {
    RowId: number;
    SaleId: number;
    CustomerId: number;
    UserCode: string = '';
    UserName: string = '';
    FullName: string = '';
    CreatedDate: Date;
    FromDate: Date;
    ToDate: Date;
    IsActive: boolean;
}