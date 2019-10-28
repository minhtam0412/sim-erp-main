import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerType } from '../../customertypecomponent/models/customertype';
import { CustomerService } from '../customer.service';
import { CustomertypeService } from '../../customertypecomponent/customertype.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { Guid } from 'guid-typescript';
import { CustomerUser } from '../model/customeruser';

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.css']
})
export class CustomerdetailComponent implements OnInit {

  objData: Customer;
  currentIndexAttachFile = -1;
  isNewModel: boolean;
  lstItemType = ListItemType;

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
  lstObjSaler: CustomerUser[] = [];

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

  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private customerService: CustomerService, private customertypeService: CustomertypeService, private productCategoryService: ProductCategoryService,
    private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService, private notificationService: NotificationService,
    private productService: ProductService, private userService: UserService) {

    this.objData = new Customer();
    this.objModelProduct = new CustomerProduct();
    this.objData.PaymentTermId = 50;

    this.dataSerachProduct = "";
    this.dataSerachEmployee = "";
    this.dataProductCategoryFilter = "";
    this.dataProductIsActiveFilter = -1;
  }

  ngOnInit() {
    this.loadCustomerType();
    this.loadGroupCompany();
    this.loadProductCategory();
    this.SearchProduct();
    this.SearchUser();
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
              console.log(this.lstProduct);
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
    this.userService.getData(this.dataSerachEmployee, 1, 0, Key_MaxRow).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            alert('Lỗi ' + res.MessageText);;
          } else {
            this.lstUser = res.RepData;
            console.log(this.lstUser);
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

  AddListSaler(SalerId: number) {
    if (!this.lstObjSaler.find(x => x.UserId == SalerId)) {
      var item: User = this.lstUser.find(x => x.UserId == SalerId);
      var saler:CustomerUser = new CustomerUser();
      saler.UserId = item.UserId;
      saler.UserCode = item.UserCode;
      saler.FullName = item.FullName;
      saler.IsActive = item.IsActive;
      saler.CreateDate = new Date();
      
      this.lstObjSaler.push(saler);
    }
  }

  AddModelProduct() {
    this.isNewModel = true;
  }

  EditModelProduct() {
    this.isNewModel = false;
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
      attachfile.OptionName = 'PRODUCT';


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

}
