export class CustomerCommission {
    RowId: number;
    BeneficiaryName: string = "";
    PhoneNumber: string;
    Email: string;
    BankAccount: string;
    BankName: string;
    Notes: string;
    CreatedBy: number;
    CreatedDate?: Date;
    ModifyBy?: number;
    DateTimeOffset?: Date;
    IsActive: boolean = true;
    CustomerId: number;
}