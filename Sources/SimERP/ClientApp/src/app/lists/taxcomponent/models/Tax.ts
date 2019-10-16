export class Tax {
    CreatedBy: number;
    CreatedDate: Date;
    IsActive: boolean = true;
    ModifyBy?: number;
    ModifyDate?: Date;
    Notes: string;
    SearchString: string;
    SortOrder?: number;
    TaxCode: string;
    TaxId: number = 0;
    TaxName: string;
    TaxPercent: number;
    UserName: string;
    DeleteUser: string;

    constructor() {
    }
}
