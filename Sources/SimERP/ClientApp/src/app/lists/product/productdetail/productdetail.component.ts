import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {Product} from '../model/product';
import {Country} from '../../country/model/country';
import {Packageunit} from '../../packageunit/model/packageunit';
import {Unit} from '../../unitcomponent/model/Unit';
import {Tax} from '../../taxcomponent/models/Tax';
import {UploadfileService} from '../../../common/uploadfile/uploadfile.service';
import {LoaderService} from '../../../common/loading/loader.service';
import {ListItemType} from '../../../common/masterdata/models';
import {Attachfile} from '../model/attachfile';
import {ProductCategory} from '../../productcategory/model/ProductCategory';
import {ProductService} from '../product.service';
import {Vendor} from '../../vendor/model/vendor';
import {Key_DefaultAttachFile} from '../../../common/config/globalconfig';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit, AfterViewInit {

  constructor(private activeModal: NgbActiveModal, private notificationService: NotificationService, private service: ProductService,
              private uploadfileService: UploadfileService, private loaderService: LoaderService) {
  }

  @Input() isAddState = true;
  @Input() productId: number;
  @Input() lstCountry: Country[];
  @Input() lstPackageUnit: Packageunit[];
  @Input() lstVendor: Vendor[];
  @Input() lstUnit: Unit[];
  @Input() lstTax: Tax[];
  lstItemType = ListItemType;
  @Input() lstProductCategory: ProductCategory[];

  private resultCloseDialog = false;
  model = new Product();
  lstFileToUpload: File[] = [];
  currentIndexAttachFile = -1;

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

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (this.isAddState) {
      this.model = new Product();
    } else {
      this.model = new Product();
      this.service.getInfo(this.productId).subscribe({
        next: res => {
          if (res && res.IsOk) {
            this.model = res.RepData;
            if (this.model) {
              this.model.ListAttachFile.forEach((attachfile) => {
                if (!this.checkIsImageByExtension(attachfile.FilePath)) {
                  attachfile.FilePathPreview = Key_DefaultAttachFile;
                } else {
                  attachfile.FilePathPreview = attachfile.FilePath;
                }
              });
            }
          } else {
            console.log(res);
            this.notificationService.showError(res.MessageText);
          }
        }, error: err => {
          console.log(err);
          this.notificationService.showError('Lỗi lấy thông tin sản phẩm!');
        }
        , complete: () => {

        }
      });
    }
  }


  saveDataModal(isContinue: boolean) {
    if (!this.validateData()) {
      return;
    }
    console.log(this.model);
    console.log(this.lstFileToUpload);
    const formData = new FormData();
    Array.from(this.lstFileToUpload).map((file) => {
      return formData.append(file.name, file, file.name);
    });

    this.service.saveData(this.model, formData, this.isAddState).subscribe(res => {
      if (res && res.IsOk) {
        this.resultCloseDialog = true;
        this.closeModal();
        this.notificationService.showSucess(this.isAddState ? 'Thêm mới' : 'Chỉnh sửa' + ' thành công!');
      } else {
        this.notificationService.showError('Lỗi thực hiện cập nhật thông tin. Vui lòng liên hệ quản trị hệ thống!');
      }
    });
  }

  closeModal() {
    this.activeModal.close(this.resultCloseDialog);
  }

  // handle on user click change AttachFile
  setCurrentAttachFileIndex(index: any) {
    this.currentIndexAttachFile = index;
  }

  // handle duplicate file name
  checkDuplicateAttachFileName(fileName) {
    if (!this.model.ListAttachFile) {
      return false;
    }
    const index = this.model.ListAttachFile.findIndex((currentValue) => {
      return currentValue.FileNameOriginal === fileName;
    });
    return index > -1;
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
        const currentAttachFile = this.model.ListAttachFile[this.currentIndexAttachFile];

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
          if (ProductdetailComponent.checkIsImageFile(file)) {
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
          if (ProductdetailComponent.checkIsImageFile(file)) {
            attachfile.FilePathPreview = imgURL;
          }

          this.model.ListAttachFile.push(attachfile);
        };
      }
      this.lstFileToUpload.push(file);
    });
  }


  // Get max Sort Order from List AttachFile
  getMaxSortOrder() {
    let maxSortOrder = Math.max.apply(Math, this.model.ListAttachFile.map(function (value) {
      return value.SortOrder;
    }));
    if (maxSortOrder === -Infinity) {
      maxSortOrder = 0;
    }
    return maxSortOrder;
  }

  // handle on user click delete attach file
  deleteAttachFile(index: number) {
    // check valid index
    if (index < 0) {
      return;
    }

    // get current AttachFile by index
    const currentAttachFile = this.model.ListAttachFile[index];
    if (!currentAttachFile) {
      return;
    }

    // AttachFile was storage in DB, add item to list for delete from DB
    if (currentAttachFile.AttachId > 0) {
      if (this.model.ListAttachFileDelete === undefined || this.model.ListAttachFileDelete == null) {
        this.model.ListAttachFileDelete = [];
      }
      this.model.ListAttachFileDelete.push(currentAttachFile);
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
    this.model.ListAttachFile.splice(index, 1);
  }

  checkIsImageByExtension(data) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(data)) {
      return false;
    }
    return true;
  }

  // handle on click open Attach File
  openAttachFile(row: Attachfile) {
    if (row) {
      console.log(row);

      if (row.FilePath.startsWith('data:')) {
        ProductdetailComponent.debugBase64(row.FilePath);
      } else {
        ProductdetailComponent.openInNewTab(row.FilePath);
      }


      // if (row.FilePath.includes(Key_DefaultAttachFileName)) {
      //   const fileName = row.FileNameOriginal;
      //   const fileToUpload = this.lstFileToUpload.find((v) => {
      //     return v.name === fileName;
      //   });
      //   if (fileToUpload) {
      //     const reader = new FileReader();
      //     reader.readAsDataURL(fileToUpload);
      //     reader.onload = () => {
      //       const data = reader.result;
      //       ProductdetailComponent.debugBase64(data);
      //     };
      //   }
      // } else {
      //   if (this.checkIsImageByExtension(row.FilePath)) {
      //     ProductdetailComponent.openInNewTab(row.FilePath);
      //   } else {
      //     ProductdetailComponent.debugBase64(row.FilePath);
      //   }
      // }
    }
  }

  // handle validate data before save
  validateData() {

    // check data Expiredday
    if (!this.model.IsUsingExpireDate) {
      this.model.ExpireDays = 0;
    }

    return true;
  }

  changeProductCategory(value) {
    // assign ProductCategoryList for product
    const productCategoryId = value;
    const productCategory = this.lstProductCategory.find((v) => {
      return v.ProductCategoryId === productCategoryId;
    });
    if (productCategory) {
      this.model.ProductCategoryList = productCategory.ParentListId;
    }
  }
}
