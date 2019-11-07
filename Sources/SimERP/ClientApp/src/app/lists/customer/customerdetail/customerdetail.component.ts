import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerType } from '../../customertypecomponent/models/customertype';
import { CustomerService } from '../customer.service';
import { CustomertypeService } from '../../customertypecomponent/customertype.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GroupCompany } from '../model/groupcompany';
import { ProductCategory } from '../../productcategory/model/ProductCategory';
import { ProductCategoryService } from '../../productcategory/product-category.service';
import { NotificationService } from 'src/app/common/notifyservice/notification.service';
import { Attachfile } from '../../product/model/attachfile';
import { Key_DefaultAttachFile, Key_MaxRow } from 'src/app/common/config/globalconfig';
import { Product } from '../../product/model/product';
import { ProductService } from '../../product/product.service';
import { CustomerProduct } from '../model/customerproduct';
import { ListItemType } from 'src/app/common/masterdata/commondata';
import { User } from 'src/app/systems/user';
import { UserService } from 'src/app/systems/user.service';
import { ComfirmDialogComponent } from 'src/app/common/comfirm-dialog/comfirm-dialog.component';
import { CustomerSale } from '../model/customersale';
import { CustomerCommission } from '../model/customercommission';
import { CustomerDelivery } from '../model/customerdelivery';
import { AuthenService } from 'src/app/systems/authen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Globalfunctions } from 'src/app/common/globalfunctions/globalfunctions';
import { deepEqual } from 'fast-equals';

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.css']
})
export class CustomerdetailComponent implements OnInit {

  customerId: number;
  objData: Customer;
  objDataBackup = Object.assign({}, this.objData);
  currentIndexAttachFile = -1;
  isNewModel: boolean;
  indexEdit: number;
  lstItemType = ListItemType;
  userAuthenInfo: any;
  //----Combobox-----
  cboCustomerType: CustomerType[] = [];
  cboGroupCompany: GroupCompany[] = [];
  cboProductCategory: ProductCategory[] = [];
  lstFileToUpload: File[] = [];

  //----Model Product---
  dataProductCategoryFilter: string;
  dataProductIsActiveFilter: number;
  dataSerachProduct: string;
  dataSerachEmployee: string;
  lstObjProduct: CustomerProduct[] = [];
  objModelProduct: CustomerProduct;
  lstProduct: Product[] = [];
  lstUser: User[] = [];

  //----Model Saler---
  IsToDate: boolean;
  dataSalerIsActiveFilter: number;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  lstObjSaler: CustomerSale[] = [];

  //----Model Commission---
  commissionIdEdit: string = "";
  dataCommissionIsActiveFilter: number;
  isNewModelCommission: boolean;
  dtcreate: NgbDateStruct;
  objModelCommission: CustomerCommission;
  lstObjCommission: CustomerCommission[] = [];

  //----Model Delivery---
  objModelDelivery: CustomerDelivery;
  isNewModelDelivery: boolean;
  //------------------

  static checkIsImageFile(file: File) {
    const mimeType = file.type;
    return mimeType.match(/image\/*/) != null;
  }

  static openInNewTab(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  static debugBase64(base64URL) {
    const win = window.open();
    win.document.title = 'SIM ERP';
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; ' +
      'width:100%; height:100%;" allowfullscreen></iframe>');
  }

  public product_autocompleteHeaderTemplate = `
  <div class="header-row">
  <div class="col-2">Mã hàng</div>
  <div class="col-3">Tên hàng</div>
  <div class="col-1">ĐVT</div>
  <div class="col-3">Ngành hàng</div>
  </div>`;

  public employee_autocompleteHeaderTemplate = `
  <div class="header-row">
  <div class="col-3">Mã nhân viên</div>
  <div class="col-4">Tên nhân viên</div>
  </div>`;

  @ViewChild('closePageDetail', { static: true }) closePageDetail: ElementRef;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;
  @ViewChild('closeAddExpenseModalSaler', { static: true }) closeAddExpenseModalSaler: ElementRef;
  @ViewChild('closeAddExpenseModalCommission', { static: true }) closeAddExpenseModalCommission: ElementRef;
  @ViewChild('closeAddExpenseModalDelivery', { static: true }) closeAddExpenseModalDelivery: ElementRef;

  constructor(private customerService: CustomerService, private customertypeService: CustomertypeService, private productCategoryService: ProductCategoryService,
    private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService, private notificationService: NotificationService,
    private productService: ProductService, private userService: UserService, private calendar: NgbCalendar, private authen: AuthenService, private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.objData = new Customer();
    this.objModelProduct = new CustomerProduct();
    this.objModelCommission = new CustomerCommission();
    this.objModelDelivery = new CustomerDelivery();
    this.objData.PaymentTermId = 50;
    
    this.userAuthenInfo = authen.extractAccessTokenData();
    this.userAuthenInfo = this.userAuthenInfo;

    this.dataSerachProduct = "";
    this.dataSerachEmployee = "";
    this.dataProductCategoryFilter = "-1";
    this.dataProductIsActiveFilter = -1;
    this.dataSalerIsActiveFilter = -1;
    this.dataCommissionIsActiveFilter = -1;
    this.indexEdit = -1;
    this.IsToDate = false;
  }

  ngOnInit() {
    this.loadCustomerType();
    this.loadGroupCompany();
    this.loadProductCategory();
    this.SearchProduct();
    this.SearchUser();

    this.customerId = this.activatedRoute.snapshot.params['id'];
    this.isNewModel = this.customerId === undefined || this.customerId == null;

    console.log("customerId: " + this.customerId);
    console.log("isNewModel: " + this.isNewModel);

    if(!this.isNewModel){
      this.loadDataDefault(this.customerId);
    }

  }

  //---Load data default---
  loadDataDefault(customerId: number) {
    this.customerService.getDataDefault(customerId).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.objData = res.RepData;
            console.log(res.RepData);
            this.lstObjProduct = Object.assign([], this.objData.objProduct);
            this.lstObjSaler = Object.assign([], this.objData.objSaler);
            this.lstObjCommission = Object.assign([], this.objData.objCommission);

            this.objData.ListAttachFile.forEach((attachfile) => {
              if (!Globalfunctions.checkIsImageByExtension(attachfile.FilePath)) {
                attachfile.FilePathPreview = Key_DefaultAttachFile;
              } else {
                attachfile.FilePathPreview = attachfile.FilePath;
              }
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.objDataBackup = Object.assign({}, this.objData);
        }
      }
    );
  }

  //---Load data combobox---
  loadCustomerType() {
    this.customertypeService.getData().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.cboCustomerType = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.objData.CustomerTypeId = this.cboCustomerType[0].CustomerTypeId;
        }
      }
    );
  }

  loadGroupCompany() {
    this.customerService.GetListGroupCompany().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.cboGroupCompany = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.objData.GroupCompanyId = this.cboGroupCompany[0].GroupCompanyId;
        }
      }
    );
  }

  loadProductCategory() {
    this.productCategoryService.getAllData().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.cboProductCategory = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {

        }
      }
    );
  }

  SaveData(isclose: boolean){
    if(!this.objData.IsGroupCompany)
      this.objData.GroupCompanyId = null;
    this.objData.CreatedBy = this.userAuthenInfo.UserId;

    console.log(this.lstFileToUpload);
    const formData = new FormData();
    Array.from(this.lstFileToUpload).map((file) => {
      return formData.append(file.name, file, file.name);
    });

    this.customerService.Insert(this.objData, formData, this.isNewModel).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.toastr.success(this.isNewModel ? 'Thêm dữ liệu thành công' : 'Dữ liệu đã được chỉnh sửa', 'Thông báo!');
          if (isclose) {
            this.router.navigate(['customer']);
          }
          else{
            this.clearObjData();
          }
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  clearObjData(){
    this.objData = new Customer();
    this.objModelProduct = new CustomerProduct();
    this.objModelCommission = new CustomerCommission();
    this.objModelDelivery = new CustomerDelivery();
    this.objData.PaymentTermId = 50;

    this.lstObjProduct = [];
    this.lstObjSaler = [];
    this.lstObjCommission = [];

    this.dataSerachProduct = "";
    this.dataSerachEmployee = "";
    this.dataProductCategoryFilter = "-1";
    this.dataProductIsActiveFilter = -1;
    this.dataSalerIsActiveFilter = -1;
    this.dataCommissionIsActiveFilter = -1;
    this.indexEdit = -1;
    this.IsToDate = false;
  }

  checkValidateAction(){
    if (this.objData.CustomerName.length <= 0 || this.objData.CustomerCode.length <= 0 || 
      this.objData.Address.length <= 0 || this.objData.DebtCeiling < 0)
      return true;
    return false;
  }

  //---------------------Tab Hàng hóa---------------------------
  SearchProduct() {
    this.productService.getData(this.dataSerachProduct, null,
      null, 0, Key_MaxRow).subscribe(
        {
          next: (res) => {
            if (!res.IsOk) {
              this.toastr.error(res.MessageText, 'Thông báo!');
            } else {
              this.lstProduct = res.RepData;
            }
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
          }
        }
      );
  }

  SearchUser() {
    this.userService.getData(this.dataSerachEmployee, -1, 0, Key_MaxRow).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            alert('Lỗi ' + res.MessageText);;
          } else {
            this.lstUser = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
        }
      }
    );
  }

  saveDataModelProduct(isclose: boolean) {
    var item: CustomerProduct = this.objModelProduct;
    this.objData.objProduct.push(item);
    this.lstObjProduct.push(item);
    this.AddListSaler(item.SaleId);
    this.clearProductModel();
    if (isclose) {
      this.closeAddExpenseModal.nativeElement.click();
    }
  }

  AddModelProduct() {
    // this.isNewModel = true;
  }

  EditModelProduct() {
    // this.isNewModel = false;
  }

  CloseProductModel() {
    this.clearProductModel();
  }

  ProductRemoveItem(ProductId: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        var item = this.objData.objProduct.find(x => x.ProductId == ProductId);

        if (this.objData.objProduct.filter(x => x.SaleId == item.SaleId).length <= 1) {
          this.SalerRemoveItem(item.SaleId);
          this.RefreshFilterSaler();
        }

        this.objData.objProduct.splice(this.objData.objProduct.findIndex(x => x.ProductId == ProductId), 1);
        this.lstObjProduct.splice(this.lstObjProduct.findIndex(x => x.ProductId == ProductId), 1);
      }
    });
  }

  clearProductModel() {
    this.objModelProduct = new CustomerProduct();
    this.dataSerachProduct = "";
    this.dataSerachEmployee = "";
  }

  product_onKeydown(event) {
    // if (event.key === 'Enter') {
    //   console.log(event);
    // }
  }

  employee_onKeydown(event) {
    // if (event.key === 'Enter') {
    //   console.log(event);
    // }
  }
  product_renderDataRowAutoComplete(data: Product): string {
    const html = `
      <div class="data-row">
        <div class="col-2">${data.ProductCode}</div>
        <div class="col-3">${data.ProductName}</div>
        <div class="col-1">${data.UnitName}</div>
        <div class="col-3">${data.ProductCategoryName}</div>
      </div>`;
    return html;
  }

  employee_renderDataRowAutoComplete(data: User): string {
    const html = `
      <div class="data-row">
        <div class="col-3">${data.UserCode}</div>
        <div class="col-4">${data.FullName}</div>
        
      </div>`;
    return html;
  }

  product_autocompleteCallback(event) {
    var item: Product = this.lstProduct.find(x => x.ProductCode == event);

    this.objModelProduct.ProductId = item.ProductId;
    this.objModelProduct.ProductCode = item.ProductCode;
    this.objModelProduct.ProductName = item.ProductName;
    this.objModelProduct.UnitName = item.UnitName;
    this.objModelProduct.ProductCategoryId = item.ProductCategoryId;
    this.objModelProduct.ProductCategoryName = item.ProductCategoryName;
    this.objModelProduct.Price = item.Price;
    this.objModelProduct.IsActive = item.IsActive;
    // this.objData.objProduct.ProductType = item.ProductType;
  }

  employee_autocompleteCallback(event) {
    var item: User = this.lstUser.find(x => x.UserCode == event);
    this.objModelProduct.SaleId = item.UserId;
    this.objModelProduct.SaleName = item.FullName;
  }

  checkValidateModelProduct() {
    if (this.objModelProduct.ProductId <= 0 || this.objModelProduct.ProductId == undefined || this.objModelProduct.SaleId <= 0 || this.objModelProduct.SaleId == undefined)
      return true;
    return false;
  }

  FilterCustomerProduct() {
    if (this.dataProductCategoryFilter == "-1" && this.dataProductIsActiveFilter == -1) {
      this.lstObjProduct = Object.assign([], this.objData.objProduct);
    }
    if (this.dataProductCategoryFilter != "-1" && this.dataProductIsActiveFilter == -1) {
      this.lstObjProduct = Object.assign([], this.objData.objProduct.filter(x => x.ProductCategoryId != null && x.ProductCategoryId.toString() == this.dataProductCategoryFilter));
    }
    if (this.dataProductCategoryFilter == "-1" && this.dataProductIsActiveFilter != -1) {
      this.lstObjProduct = Object.assign([], this.objData.objProduct.filter(x => x.IsActive == (this.dataProductIsActiveFilter == 1)));
    }
    if (this.dataProductCategoryFilter != "-1" && this.dataProductIsActiveFilter != -1) {
      this.lstObjProduct = Object.assign([], this.objData.objProduct.filter(x => x.ProductCategoryId != null && x.ProductCategoryId.toString() == this.dataProductCategoryFilter
        && x.IsActive == (this.dataProductIsActiveFilter == 1)));
    }
  }

  //---------------------Tab Saler---------------------
  saveDataModelSaler(isclose: boolean) {
    if (this.indexEdit != -1 && this.indexEdit != undefined) {
      var item: CustomerSale = this.lstObjSaler[this.indexEdit];
      if (this.fromDate != null) {
        let fromDate = new Date(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day);
        item.FromDate = fromDate;
      }

      if(!this.IsToDate){
        this.toDate = null;
        item.ToDate = null;
      }
        
      if (this.toDate != null) {
        let toDate = new Date(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day);
        item.ToDate = toDate;
      }

      this.lstObjSaler[this.lstObjSaler.findIndex(x => x.SaleId == item.SaleId)] = item;
      this.objData.objSaler[this.objData.objSaler.findIndex(x => x.SaleId == item.SaleId)] = item;

      if (isclose) {
        this.closeAddExpenseModalSaler.nativeElement.click();
      }
    }
  }

  AddListSaler(SalerId: number) {
    if (!this.lstObjSaler.find(x => x.SaleId == SalerId)) {
      var item: User = this.lstUser.find(x => x.UserId == SalerId);
      var saler: CustomerSale = new CustomerSale();
      saler.SaleId = item.UserId;
      saler.UserCode = item.UserCode;
      saler.FullName = item.FullName;
      saler.IsActive = item.IsActive;
      saler.CreatedDate = new Date();

      console.log(saler.CreatedDate);

      this.objData.objSaler.push(saler);
      this.lstObjSaler.push(saler);
      this.RefreshFilterSaler();
    }
  }

  EditModelSaler(index: number) {
    this.indexEdit = index;
    if (this.lstObjSaler[index].FromDate != undefined && this.lstObjSaler[index].FromDate != null) {
      let fromdate_tem = new Date(this.lstObjSaler[index].FromDate.toString());
      var dtfrom: NgbDate = new NgbDate(fromdate_tem.getFullYear(), fromdate_tem.getMonth() + 1, fromdate_tem.getDate());
      this.fromDate = dtfrom;
    }

    if (this.lstObjSaler[index].ToDate != undefined && this.lstObjSaler[index].ToDate != null) {
      this.IsToDate = true;
      let todate_tem = new Date(this.lstObjSaler[index].ToDate.toString());
      var dtto: NgbDate = new NgbDate(todate_tem.getFullYear(), todate_tem.getMonth() + 1, todate_tem.getDate());
      this.toDate = dtto;
    }
  }

  CloseSalerModel() {
    this.indexEdit = -1;
    this.fromDate = null;
    this.toDate = null;
    this.IsToDate = false;
  }

  SalerRemoveItem(SaleId: number) {
    this.objData.objSaler.splice(this.objData.objSaler.findIndex(x => x.SaleId == SaleId), 1);
    this.lstObjSaler.splice(this.lstObjSaler.findIndex(x => x.SaleId == SaleId), 1);
  }

  FilterCustomerSaler() {
    if (this.dataSalerIsActiveFilter == -1)
      this.lstObjSaler = Object.assign([], this.objData.objSaler);
    else
      this.lstObjSaler = Object.assign([], this.objData.objSaler.filter(x => x.IsActive == (this.dataSalerIsActiveFilter == 1)));
  }

  RefreshFilterSaler() {
    this.dataSalerIsActiveFilter = -1;
    this.FilterCustomerSaler();
  }

  //---------------------Tab Commission---------------------
  saveDataModelCommission(isclose: boolean) {
    this.objModelCommission.CreatedDate = new Date(this.dtcreate.year, this.dtcreate.month, this.dtcreate.day);
    if (this.isNewModelCommission) {
      this.lstObjCommission.push(this.objModelCommission);
      this.objData.objCommission.push(this.objModelCommission)
    }
    else {
      this.lstObjCommission[this.lstObjCommission.findIndex(x => x.PhoneNumber == this.commissionIdEdit)] = this.objModelCommission;
      this.objData.objCommission[this.objData.objCommission.findIndex(x => x.PhoneNumber == this.commissionIdEdit)] = this.objModelCommission;
    }

    this.clearCommissionModel();

    if (isclose) {
      this.closeAddExpenseModalCommission.nativeElement.click();
    }
  }

  CloseCommissionModel() {

  }

  AddModelCommission() {
    this.isNewModelCommission = true;
    this.dtcreate = this.calendar.getToday();
  }

  EditModelCommission(PhoneNumber: string) {
    this.isNewModelCommission = false;
    this.commissionIdEdit = PhoneNumber;

    var index = this.lstObjCommission.findIndex(x => x.PhoneNumber == PhoneNumber);
    if (this.lstObjCommission[index].CreatedDate != undefined && this.lstObjCommission[index].CreatedDate != null) {
      let date_tem = new Date(this.lstObjCommission[index].CreatedDate.toString());
      var dt: NgbDate = new NgbDate(date_tem.getFullYear(), date_tem.getMonth(), date_tem.getDate());
      this.dtcreate = dt;
    }

    this.objModelCommission = Object.assign({}, this.lstObjCommission[index]);
  }

  CommissionRemoveItem(PhoneNumber: string) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.lstObjCommission.splice(this.lstObjCommission.findIndex(x => x.PhoneNumber == PhoneNumber), 1);
        this.objData.objCommission.splice(this.objData.objCommission.findIndex(x => x.PhoneNumber == PhoneNumber), 1);
      }
    });
  }

  clearCommissionModel() {
    this.objModelCommission = new CustomerCommission();
    // this.dataCommissionIsActiveFilter = -1;
  }

  FilterCustomerCommission() {
    if (this.dataCommissionIsActiveFilter == -1) {
      this.lstObjCommission = Object.assign([], this.objData.objCommission);
    }
    if (this.dataCommissionIsActiveFilter != -1) {
      this.lstObjCommission = Object.assign([], this.objData.objCommission.filter(x => x.IsActive == (this.dataCommissionIsActiveFilter == 1)));
    }
  }

  checkValidateModelCommission() {
    if (this.objModelCommission.BeneficiaryName.length <= 0 || this.objModelCommission.PhoneNumber.length <= 0)
      return true;
    return false;
  }
  //---------------------Tab Delivery---------------------
  saveDataModelDelivery(isclose: boolean){
    this.objModelDelivery.CreatedDate = new Date(this.dtcreate.year, this.dtcreate.month, this.dtcreate.day);
    this.objModelDelivery.CreatedBy = this.userAuthenInfo.UserId;
    if (this.isNewModelDelivery) {
      this.objData.objDelivery.push(this.objModelDelivery)
    }
    else {
      this.objData.objDelivery[this.indexEdit] = this.objModelDelivery;
    }

    this.clearDeliveryModel();

    if (isclose) {
      this.closeAddExpenseModalDelivery.nativeElement.click();
    }
  }

  AddModelDelivery(){
    this.isNewModelDelivery = true;
    this.clearDeliveryModel();
    this.dtcreate = this.calendar.getToday();
  }

  EditModelDelivery(index: number){
    this.indexEdit = index;
    this.isNewModelDelivery = false;

    if (this.objData.objDelivery[index].CreatedDate != undefined && this.objData.objDelivery[index].CreatedDate != null) {
      let date_tem = new Date(this.objData.objDelivery[index].CreatedDate.toString());
      var dt: NgbDate = new NgbDate(date_tem.getFullYear(), date_tem.getMonth(), date_tem.getDate());
      this.dtcreate = dt;
    }
    this.objModelDelivery = Object.assign({}, this.objData.objDelivery[index]);
  }

  DeliveryRemoveItem(index: number) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.objData.objDelivery.splice(index, 1);
      }
    });
  }

  clearDeliveryModel(){
    this.objModelDelivery = new CustomerDelivery();
  }

  checkValidateModelDelivery() {
    if (this.objModelDelivery.DeliveryPlace.length <= 0 || this.objModelDelivery.DeliveryAddress.length <= 0)
      return true;
    return false;
  }

  CloseDeliveryModel(){

  }
  //---------------------Tab file---------------------------
  // handle on user click delete attach file
  deleteAttachFile(index: number) {
    // check valid index
    if (index < 0) {
      return;
    }

    // get current AttachFile by index
    const currentAttachFile = this.objData.ListAttachFile[index];
    if (!currentAttachFile) {
      return;
    }

    // AttachFile was storage in DB, add item to list for delete from DB
    if (currentAttachFile.AttachId > 0) {
      if (this.objData.ListAttachFileDelete === undefined || this.objData.ListAttachFileDelete == null) {
        this.objData.ListAttachFileDelete = [];
      }
      this.objData.ListAttachFileDelete.push(currentAttachFile);
    }

    // find index by filename from List File To Upload
    const indexInListToUpload = this.lstFileToUpload.findIndex((file) => {
      return file.name === currentAttachFile.FileNameOriginal;
    });

    // check valid index, delete from List File To Upload
    if (indexInListToUpload > -1) {
      this.lstFileToUpload.splice(indexInListToUpload, 1);
    }

    // delete from List AttachFile
    this.objData.ListAttachFile.splice(index, 1);
  }

  // handle on user click change AttachFile
  setCurrentAttachFileIndex(index: any) {
    this.currentIndexAttachFile = index;
    return true;
  }

  // handle on click open Attach File
  openAttachFile(row: Attachfile) {
    if (row) {
      console.log(row);

      if (row.FilePath.startsWith('data:')) {
        CustomerdetailComponent.debugBase64(row.FilePath);
      } else {
        CustomerdetailComponent.openInNewTab(row.FilePath);
      }
    }
  }

  // handle duplicate file name
  checkDuplicateAttachFileName(fileName) {
    if (!this.objData.ListAttachFile) {
      return false;
    }
    const index = this.objData.ListAttachFile.findIndex((currentValue) => {
      return currentValue.FileNameOriginal === fileName;
    });
    return index > -1;
  }

  // Get max Sort Order from List AttachFile
  getMaxSortOrder() {
    let maxSortOrder = Math.max.apply(Math, this.objData.ListAttachFile.map(function (value) {
      return value.SortOrder;
    }));
    if (maxSortOrder === -Infinity) {
      maxSortOrder = 0;
    }
    return maxSortOrder;
  }

  // handle on user choosed file
  public changeFile(files) {
    let imgURL: any;
    const lstNewFile: File[] = files;
    Array.from(lstNewFile).map((file) => {

      if (this.checkDuplicateAttachFileName(file.name)) {
        this.notificationService.showInfo('Vui lòng không chọn trùng tên tập tin!');
        return;
      }

      const attachfile: Attachfile = new Attachfile();
      attachfile.FileNameOriginal = file.name;
      attachfile.FileSize = file.size;
      attachfile.OptionName = 'CUSTOMER';


      // Current state is EditMode
      if (this.currentIndexAttachFile > -1) {
        // get current object AttachFile by row index
        const currentAttachFile = this.objData.ListAttachFile[this.currentIndexAttachFile];

        const oldAttachIndex = this.lstFileToUpload.findIndex((value) => {
          return value.name === currentAttachFile.FileNameOriginal;
        });
        if (oldAttachIndex > -1) {
          this.lstFileToUpload.splice(oldAttachIndex, 1);
        }

        currentAttachFile.FileNameOriginal = attachfile.FileNameOriginal;
        currentAttachFile.FileSize = attachfile.FileSize;
        currentAttachFile.OptionName = attachfile.OptionName;


        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          imgURL = reader.result;
          currentAttachFile.FilePath = imgURL;
          if (CustomerdetailComponent.checkIsImageFile(file)) {
            currentAttachFile.FilePathPreview = imgURL;
          } else {
            currentAttachFile.FilePathPreview = Key_DefaultAttachFile;
          }
        };

        this.currentIndexAttachFile = -1;
      } else {
        // If current state is AddState => auto assign new SordOrder valua
        attachfile.SortOrder = this.getMaxSortOrder() + 1;
        attachfile.IsNew = true;
        attachfile.FilePathPreview = Key_DefaultAttachFile;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          imgURL = reader.result;
          attachfile.FilePath = imgURL;
          if (CustomerdetailComponent.checkIsImageFile(file)) {
            attachfile.FilePathPreview = imgURL;
          }

          this.objData.ListAttachFile.push(attachfile);
        };
      }
      this.lstFileToUpload.push(file);
    });
  }

  goBack() {
    const isEqualObject = deepEqual(this.objData, this.objDataBackup);
    if (!isEqualObject) {
      const modalRef = this.modalService.open(ComfirmDialogComponent, {
        backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'sm'
      });
      modalRef.componentInstance.contentMessage = 'Dữ liệu đã bị thay đổi. Bạn có muốn tiếp tục hay không?';
      // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
      modalRef.result.then((result) => {
        if (result !== undefined && result != null && result === true) {
          this.router.navigate(['customer']);
        }
      }, (reason) => {
        console.log(reason);
      });
    } else {
      this.router.navigate(['customer']);
    }
  }
}
