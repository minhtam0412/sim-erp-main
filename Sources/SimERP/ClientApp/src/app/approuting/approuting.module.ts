import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeLayoutComponent} from '../systems/layouts/home-layout.component';
import {AuthGuard} from '../systems/authguard';
import {TaxComponent} from '../lists/taxcomponent/tax/tax.component';
import {LoginLayoutComponent} from '../systems/layouts/login-layout.component';
import {LoginComponent} from '../systems/login/login.component';
import {UnitComponent} from '../lists/unitcomponent/unit/unit.component';
import {PurchasemanagementComponent} from '../vouchers/purchase/purchasemanagement/purchasemanagement.component';
import {PurchasedetailinfoComponent} from '../vouchers/purchase/purchasedetailinfo/purchasedetailinfo.component';
import {CustomertypelistComponent} from '../lists/customertypecomponent/customertypelist/customertypelist.component';
import {VendortypeComponent} from '../lists/vendortype/vendortype/vendortype.component';
import {PagenotfoundComponent} from '../common/pagenotfound/pagenotfound.component';
import {UserComponent} from '../systems/user/user.component';
import {LogoutComponent} from '../systems/logout/logout.component';
import {FirstchangepasswordComponent} from '../systems/firstchangepassword/firstchangepassword.component';
import {PagelistComponent} from '../lists/pagelist/pagelist/pagelist.component';
import {ProductlistComponent} from '../lists/product/productlist/productlist.component';
import {ProductCategoryComponent} from '../lists/productcategory/product-category/product-category.component';
import {CustomerComponent} from '../lists/customer/customer/customer.component';
import {RolelistComponent} from '../lists/rolelist/rolelist/rolelist.component';
import {UserpermissionComponent} from '../systems/userpermission/userpermission/userpermission.component';
import {CustomerdetailComponent} from '../lists/customer/customerdetail/customerdetail.component';
import {ZorrocustomComponent} from '../lists/customcontrol/zorrocustom/zorrocustom.component';
import {SupplierlistComponent} from '../lists/supplier/vendorlist/supplierlist.component';
import {SupplierdetailComponent} from '../lists/supplier/vendordetail/supplierdetail.component';
import {StocklistComponent} from '../lists/stock/stocklist/stocklist.component';
import {CurrencylistComponent} from '../lists/currency/currencylist/currencylist.component';
import {ExchangeratelistComponent} from '../lists/exchangerate/exchangeratelist/exchangeratelist.component';
import {SaleorderlistComponent} from '../vouchers/saleorder/saleorderlist/saleorderlist.component';
import {SaleorderdetailComponent} from '../vouchers/saleorder/saleorderdetail/saleorderdetail.component';
import {ReportsaleorderComponent} from '../vouchers/saleorder/printtemplate/reportsaleorder/reportsaleorder.component';


const routes: Routes = [
  {
    path: '', component: HomeLayoutComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {path: 'tax', component: TaxComponent},
      {path: 'unit', component: UnitComponent},
      {path: 'purchase', component: PurchasemanagementComponent},
      {path: 'purchaseinvoice', component: PurchasedetailinfoComponent},
      {path: 'purchaseinvoice/:id', component: PurchasedetailinfoComponent},
      {path: 'customertype', component: CustomertypelistComponent},
      {path: 'vendortype', component: VendortypeComponent},
      {path: 'user', component: UserComponent},
      {path: 'pagelist', component: PagelistComponent},
      {path: 'product', component: ProductlistComponent},
      {path: 'productcategory', component: ProductCategoryComponent},
      {path: 'customer', component: CustomerComponent},
      {path: 'customerdetail', component: CustomerdetailComponent},
      {path: 'customerdetail/:id', component: CustomerdetailComponent},
      {path: 'rolelist', component: RolelistComponent},
      {path: 'userpermission', component: UserpermissionComponent},
      {path: 'vendor', component: SupplierlistComponent},
      {path: 'vendordetail', component: SupplierdetailComponent},
      {path: 'vendordetail/:id', component: SupplierdetailComponent},
      {path: 'zorrocustom', component: ZorrocustomComponent},
      {path: 'stock', component: StocklistComponent},
      {path: 'currency', component: CurrencylistComponent},
      {path: 'exchangerate', component: ExchangeratelistComponent},
      {path: 'saleorder', component: SaleorderlistComponent},
      {path: 'saleorderdetail', component: SaleorderdetailComponent},
      {path: 'saleorderdetail/:id', component: SaleorderdetailComponent},
    ]
  },
  {
    path: '', component: LoginLayoutComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'quit', component: LogoutComponent},
      {path: 'firstchangepassword', component: FirstchangepasswordComponent}
    ]
  },
  {path: '**', component: PagenotfoundComponent},

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class ApproutingModule {
}
