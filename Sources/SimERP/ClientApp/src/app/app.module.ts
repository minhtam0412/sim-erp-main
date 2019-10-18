import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HeaderComponent } from './header/header.component';
import { TaxComponent } from './lists/taxcomponent/tax/tax.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PaginationComponent } from './pagination/pagination.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxinfoComponent } from './lists/taxcomponent/taxinfo/taxinfo.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PurchasemanagementComponent } from './vouchers/purchase/purchasemanagement/purchasemanagement.component';
import { PurchasedetailinfoComponent } from './vouchers/purchase/purchasedetailinfo/purchasedetailinfo.component';
import { UnitComponent } from './lists/unitcomponent/unit/unit.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComfirmDialogComponent } from './common/comfirm-dialog/comfirm-dialog.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { CustomertypelistComponent } from './lists/customertypecomponent/customertypelist/customertypelist.component';
import { CustomertypedetailComponent } from './lists/customertypecomponent/customertypedetail/customertypedetail.component';
import { LoginComponent } from './systems/login/login.component';
import { AuthGuard } from './systems/authguard';
import { VendortypeComponent } from './lists/vendortype/vendortype/vendortype.component';
import { HomeLayoutComponent } from './systems/layouts/home-layout.component';
import { LoginLayoutComponent } from './systems/layouts/login-layout.component';
import { HomeComponent } from './home/home.component';
import { ApproutingModule } from './approuting/approuting.module';
import { PagenotfoundComponent } from './common/pagenotfound/pagenotfound.component';
import { UserComponent } from './systems/user/user.component';
import { JwtModule } from '@auth0/angular-jwt';
import { Key_UserInfo } from './common/config/globalconfig';
import { JwtInterceptor } from './systems/login/jwtinterceptor';
import { LogoutComponent } from './systems/logout/logout.component';
import { ChangepasswordComponent } from './systems/changepassword/changepassword.component';
import { FirstchangepasswordComponent } from './systems/firstchangepassword/firstchangepassword.component';
import { LoadingComponent } from './common/loading/loading.component';
import {CookieService} from 'ngx-cookie-service';
import { CheckpermissionDirective } from './common/checkpermission/checkpermission.directive';
import { PagelistComponent } from './lists/pagelist/pagelist/pagelist.component';
import { ProductCategoryComponent } from './lists/productcategory/product-category/product-category.component';
import { CustomerComponent } from './lists/customer/customer/customer.component';
import { RolelistComponent } from './lists/rolelist/rolelist/rolelist.component';
import { ProductlistComponent } from './lists/product/productlist/productlist.component';
import { ProductdetailComponent } from './lists/product/productdetail/productdetail.component';
import {NgSelectModule} from '@ng-select/ng-select';


export function tokenGetter() {
  const objToken = JSON.parse(localStorage.getItem(Key_UserInfo));
  return objToken['access_token'];
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    TaxComponent,
    PaginationComponent,
    TaxinfoComponent,
    PurchasemanagementComponent,
    PurchasedetailinfoComponent,
    UnitComponent,
    ComfirmDialogComponent,
    CustomertypelistComponent,
    CustomertypedetailComponent,
    LoginComponent,
    CustomertypedetailComponent,
    VendortypeComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    HomeComponent,
    PagenotfoundComponent,
    UserComponent,
    LogoutComponent,
    ChangepasswordComponent,
    FirstchangepasswordComponent,
    LoadingComponent,
    CheckpermissionDirective,
    PagelistComponent,
    ProductlistComponent,
    ProductdetailComponent,
    ProductCategoryComponent,
    CustomerComponent,
    RolelistComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgbDatepickerModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule,
    ApproutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [''],
        blacklistedRoutes: ['']
      }
    }),
    NgSelectModule
  ],
  providers: [AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
  entryComponents:
    [
      TaxinfoComponent,
      ComfirmDialogComponent,
      CustomertypedetailComponent,
      ChangepasswordComponent,
      ProductdetailComponent
    ],

})

export class AppModule {
}
