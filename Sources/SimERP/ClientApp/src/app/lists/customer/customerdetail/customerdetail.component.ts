import { Component, OnInit } from '@angular/core';
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
import { Key_DefaultAttachFile } from 'src/app/common/config/globalconfig';

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.css']
})
export class CustomerdetailComponent implements OnInit {

  objData: Customer;
  currentIndexAttachFile = -1;
  lstFileToUpload: File[] = [];
  //---Combobox---
  cboCustomerType: CustomerType[] = [];
  cboGroupCompany: GroupCompany[] = [];
  cboProductCategory: ProductCategory[] = [];

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

  constructor(private customerService:CustomerService, private customertypeService:CustomertypeService, private productCategoryService: ProductCategoryService,
     private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService, private notificationService: NotificationService) { 

    this.objData = new Customer;
    this.objData.PaymentTermId = 50;
  }

  ngOnInit() {
    this.loadCustomerType();
    this.loadGroupCompany();
    this.loadProductCategory();
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
          // this.objData = this.cboGroupCompany[0].GroupCompanyId;
        }
      }
    );
  }

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
