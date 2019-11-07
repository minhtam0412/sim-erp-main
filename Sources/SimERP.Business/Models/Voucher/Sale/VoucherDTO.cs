using System.Collections.Generic;

namespace SimERP.Business.Models.Voucher.Sale
{
    public class SaleInvoice : SimERP.Data.DBEntities.SaleInvoice
    {
        public string UserName { get; set; } //người tạo
        public string SaleRefFullName { get; set; } //nhân viên giao hàng
        public List<SaleInvoiceDetail> ListSaleOrderDetail { get; set; }
        public List<SaleInvoiceDetail> ListSaleOrderDetailDelete { get; set; }
    }

    public class SaleInvoiceDetail : SimERP.Data.DBEntities.SaleInvoiceDetail
    {
        public string UnitName { get; set; } //đơn vị tính
    }
}