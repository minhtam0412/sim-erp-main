import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {UploadfileService} from '../../../common/uploadfile/uploadfile.service';
import {LoaderService} from '../../../common/loading/loader.service';
import {SupplierService} from '../supplier.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ListCurrency} from '../../../common/masterdata/commondata';
import {PaymentTerm} from '../../paymentterm/model/paymentterm';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';
import {VendorType} from '../../vendortype/model/vendortype';
import {Vendor} from '../model/vendor';
import {Attachfile} from '../../product/model/attachfile';
import {Key_DefaultAttachFile} from '../../../common/config/globalconfig';
import {VendorProduct} from '../model/vendorproduct';
import {Globalfunctions} from '../../../common/globalfunctions/globalfunctions';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupproductComponent} from '../popupproduct/popupproduct.component';
import {Product} from '../../product/model/product';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {deepEqual} from 'fast-equals';

@Component({
  selector: 'app-supplierdetail',
  templateUrl: './supplierdetail.component.html',
  styleUrls: ['./supplierdetail.component.css']
})
export class SupplierdetailComponent implements OnInit {
  lstCurrency = ListCurrency;
  @Input() lstPaymentTerm: PaymentTerm[] = [];
  model: Vendor = new Vendor();
  modelBackup = Object.assign({}, this.model);
  lstVendorType: VendorType[] = [];
  currentIndexAttachFile = -1;
  lstFileToUpload: File[] = [];
  isAddState = false;
  vendorId = '';

  constructor(private notificationService: NotificationService, private service: SupplierService,
              private uploadfileService: UploadfileService, public loaderService: LoaderService, private activatedRoute: ActivatedRoute,
              private masterdataService: MasterdataService, private modalService: NgbModal, private router: Router) {
    this.loadCommonData().subscribe(res => {
      this.lstPaymentTerm = (res[0] as ResponeResult).RepData;
      this.lstVendorType = (res[1] as ResponeResult).RepData;
    });
  }

  ngOnInit() {
    this.vendorId = this.activatedRoute.snapshot.params['id'];
    this.isAddState = this.vendorId === undefined || this.vendorId == null;
    if (this.isAddState) {
      this.model = new Vendor();
    } else {
      this.service.getInfo(Number(this.vendorId)).subscribe({
        next: res => {
          if (res && res.IsOk) {
            this.model = res.RepData;
            if (this.model) {
              this.model.ListAttachFile.forEach((attachfile) => {
                if (!Globalfunctions.checkIsImageByExtension(attachfile.FilePath)) {
                  attachfile.FilePathPreview = Key_DefaultAttachFile;
                } else {
                  attachfile.FilePathPreview = attachfile.FilePath;
                }
              });
            }
            this.modelBackup = Object.assign({}, this.model);
          } else {
            console.log(res);
            this.notificationService.showError(res.MessageText);
          }
        }, error: err => {
          console.log(err);
          this.notificationService.showError('Lỗi load thông tin!');
        }
        , complete: () => {

        }
      });
    }
  }

  loadCommonData(): Observable<any[]> {
    const resPaymentTerm = this.masterdataService.getPaymentTermData();
    const resVendorType = this.masterdataService.getVendorTypeData();
    return forkJoin([resPaymentTerm, resVendorType]);
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

  changeFile(files) {
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
      attachfile.OptionName = 'VENDORPRODUCT';


      // Current state is EditMode
      if (this.currentIndexAttachFile >= 0) {
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
          if (Globalfunctions.checkIsImageFile(file)) {
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
          if (Globalfunctions.checkIsImageFile(file)) {
            attachfile.FilePathPreview = imgURL;
          }

          this.model.ListAttachFile.push(attachfile);
        };
      }
      this.lstFileToUpload.push(file);
    });

  }

  openAttachFile(row: any) {
    if (row) {
      if (row.FilePath.startsWith('data:')) {
        Globalfunctions.debugBase64(row.FilePath);
      } else {
        Globalfunctions.openInNewTab(row.FilePath);
      }
    }
  }

  setCurrentAttachFileIndex(index: number) {
    this.currentIndexAttachFile = index;
    return true;
  }

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

  addProduct() {
    const modalRef = this.modalService.open(PopupproductComponent, {
      backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'lg'
    });

    modalRef.componentInstance.vendor = this.model;

    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result !== undefined && result != null) {
        const productSelected = result as Product;
        if (productSelected !== undefined && productSelected != null) {
          const vendorProduct = new VendorProduct();
          vendorProduct.ProductId = productSelected.ProductId;
          vendorProduct.ProductCode = productSelected.ProductCode;
          vendorProduct.ProductName = productSelected.ProductName;
          vendorProduct.UnitName = productSelected.UnitName;
          vendorProduct.CountryName = productSelected.CountryName;
          vendorProduct.ProductCategoryName = productSelected.ProductCategoryName;
          vendorProduct.IsActive = productSelected.IsActive;
          this.model.ListVendorProduct.push(vendorProduct);
        }
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  confirmDeleteProduct(index) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        const vendorProduct = Object.assign({}, this.model.ListVendorProduct[index]);
        this.model.ListVendorProduct.splice(index, 1);
        if (vendorProduct.RowId > -1) {
          if (this.model.ListVendorProductDelete == null) {
            this.model.ListVendorProductDelete = [];
          }
          this.model.ListVendorProductDelete.push(vendorProduct);
        }
      }
    });
  }

  saveData(isContinue: boolean) {
    const formData = new FormData();
    Array.from(this.lstFileToUpload).map((file) => {
      return formData.append(file.name, file, file.name);
    });
    this.service.saveData(this.model, formData, this.isAddState).subscribe(res => {
      if (res && res.IsOk) {
        const message = (this.isAddState ? 'Thêm mới' : 'Chỉnh sửa') + ' thành công!';
        this.notificationService.showSucess(message);
        if (isContinue) {
          this.isAddState = true;
          this.lstFileToUpload = [];
          this.model = new Vendor();
        } else {

        }
      } else {
        this.notificationService.showError(res.MessageText);
      }
    });
  }

  goBack() {
    const isEqualObject = deepEqual(this.model, this.modelBackup);
    if (!isEqualObject) {
      const modalRef = this.modalService.open(ComfirmDialogComponent, {
        backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'lg'
      });
      modalRef.componentInstance.contentMessage = 'Dữ liệu đã bị thay đổi. Bạn có muốn tiếp tục hay không?';
      // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
      modalRef.result.then((result) => {
        if (result !== undefined && result != null && result === true) {
          this.router.navigate(['supplier']);
        }
      }, (reason) => {
        console.log(reason);
      });
    } else {
      this.router.navigate(['supplier']);
    }
  }
}
