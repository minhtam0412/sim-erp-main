export class Purchase {
    PurchaseCode: string;
    VoucherDate: Date;
    AccountingDate: Date;
    ReferenceCode: string;
    VendorCode: string;
    VendorName: string;
    UserName: string;
    TotalAmount: number;
    IsPost: boolean;
}

export class Merchandise {
    Code: string;
    Name: string;
    Unit: string;
    Amount: number;
    Price: number;
    Money: number;
    Promotion: number;
    VAT: number;
    TotalMoney: number;
    QD_HSD: number;
    ExpiryDate: Date;
    Lot: number;
}

export class MerchandiseInfo {
    VendorName: string;
    VendorAddress: string;
    VendorPhone: string;
    ReferenceCode: number;
    Notes: number;
    PurchaseCode: number;
    VoucherDate: number;
    AccountingDate: number;
    CreatedDate: number;
    PaymentMethodID: number;
    PaymentTermID: Date;
    StockID: number;
    balanceAmount:number;
    ListMerchandise: Merchandise[];

}