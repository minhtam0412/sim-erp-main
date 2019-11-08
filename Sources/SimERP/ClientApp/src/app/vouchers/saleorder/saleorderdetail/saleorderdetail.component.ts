import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ListPaymentMethod} from '../../../common/masterdata/commondata';
import {PaymentTerm} from '../../../lists/paymentterm/model/paymentterm';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {UploadfileService} from '../../../common/uploadfile/uploadfile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';
import {Globalfunctions} from '../../../common/globalfunctions/globalfunctions';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {PopupproductComponent} from '../../../lists/supplier/popupproduct/popupproduct.component';
import {Product} from '../../../lists/product/model/product';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {deepEqual} from 'fast-equals';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import {Customer} from '../../../lists/customer/model/customer';
import {CustomerService} from '../../../lists/customer/customer.service';
import {CustomerDelivery} from '../../../lists/customer/model/customerdelivery';
import {CustomerSale} from '../../../lists/customer/model/customersale';
import {Stock} from '../../../lists/stock/model/stock';
import {AuthenService} from '../../../systems/authen.service';
import {User} from '../../../systems/user';
import {Tax} from '../../../lists/taxcomponent/models/Tax';
import {ExchangeRate} from '../../../lists/exchangerate/model/exchangerate';
import {SaleInvoice} from '../model/saleorder';
import {SaleInvoiceDetail} from '../model/saleorderdetail';
import {SaleorderService} from '../saleorder.service';
import moment from 'moment';
import 'moment/locale/vi';
import {Key_Id_OtherReport, Key_Id_PrintReport} from '../../../common/config/globalconfig';
import {ReportsaleorderComponent} from '../printtemplate/reportsaleorder/reportsaleorder.component';


@Component({
  selector: 'app-saleorderdetail',
  templateUrl: './saleorderdetail.component.html',
  styleUrls: ['./saleorderdetail.component.css']
})
export class SaleorderdetailComponent implements OnInit, AfterViewInit {

  @Input() lstPaymentTerm: PaymentTerm[] = [];
  model: SaleInvoice = new SaleInvoice();
  modelBackup = Object.assign({}, this.model);
  lstCustomer: Customer[] = [];
  currentIndexAttachFile = -1;
  lstFileToUpload: File[] = [];
  isAddState = false;
  id = -1;

  // setup datetimepicker
  bsConfig: Partial<BsDatepickerConfig>;
  locale = 'vi';
  colorTheme = 'theme-blue';

  autocompleteHeaderTemplate = `
  <div class="header-row">
  <div class="col-4">Mã khách hàng</div>
  <div class="col-4">Tên khách hàng</div>
  </div>`;

  lstCustomerDelivery: CustomerDelivery[] = [];
  lstCustomerSale: CustomerSale[] = [];
  lstPaymentMethod = ListPaymentMethod;
  lstExchangeRate: ExchangeRate[] = [];
  lstStock: Stock[] = [];
  sessionUser: User;
  lstTax: Tax[] = [];
  @ViewChild('reportsaleorder', {static: false}) reportsaleorder: ElementRef;
  @ViewChild('reportsaleordercancel', {static: false}) reportsaleordercancel: ElementRef;
  lstReportComponent: ElementRef[] = [];

  constructor(private notificationService: NotificationService, private service: SaleorderService,
              private uploadfileService: UploadfileService, private activatedRoute: ActivatedRoute,
              private masterdataService: MasterdataService, private modalService: NgbModal, private router: Router,
              private localeService: BsLocaleService, private customerService: CustomerService,
              private authenService: AuthenService, private renderer2: Renderer2) {
    this.loadCommonData().subscribe(res => {
      this.lstCustomer = (res[0] as ResponeResult).RepData;
      this.lstExchangeRate = (res[1] as ResponeResult).RepData;
      this.lstStock = (res[2] as ResponeResult).RepData;
      this.lstTax = (res[3] as ResponeResult).RepData;
      console.log(this.lstCustomer);
    });
  }

  ngOnInit() {
    // this.localeService.use(this.locale);
    moment.locale('vi');
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme, showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY HH:mm:ss'
    });

    this.authenService.currentUser.subscribe(res => {
      this.sessionUser = res;
    });

    this.id = this.activatedRoute.snapshot.params['id'];
    this.isAddState = this.id === undefined || this.id == null;
    if (this.isAddState) {
      this.model = new SaleInvoice();
      this.model.UserName = this.sessionUser.FullName;
      this.model.CreatedBy = this.sessionUser.UserId;
      this.modelBackup = Object.assign({}, this.model);
    } else {
      this.service.getInfo(Number(this.id)).subscribe({
        next: res => {
          if (res && res.IsOk) {
            this.model = res.RepData;
            console.log(this.model);
            if (this.model.VoucherDate != null) {
              const dt = moment(this.model.VoucherDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
              dt.setHours(dt.getHours() + Math.abs(dt.getTimezoneOffset() / 60));
              this.model.VoucherDate = dt;
            }

            if (this.model.CreatedDate != null) {
              const dt = moment(this.model.CreatedDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
              dt.setHours(dt.getHours() + Math.abs(dt.getTimezoneOffset() / 60));
              this.model.CreatedDate = dt;
            }
          } else {
            console.log(res);
            this.notificationService.showError(res.MessageText);
          }
        }, error: err => {
          console.log(err);
          this.notificationService.showError('Lỗi load thông tin!');
        }
        , complete: () => {
          this.modelBackup = Object.assign({}, this.model);
          this.customerService.getDataDefault(this.model.CustomerId).subscribe(res => {
            if (res !== undefined && res.IsOk) {
              console.log(res.RepData);
              const customerDetail = res.RepData as Customer;
              this.lstCustomerDelivery = customerDetail.objDelivery;
              this.lstCustomerSale = customerDetail.objSaler;
            }
          });
        }
      });
    }

  }

  loadCommonData(): Observable<any[]> {
    const reqCustomer = this.masterdataService.getCustomerData();
    const reqExchangeRate = this.masterdataService.getExchangeRateLastestData();
    const reqStock = this.masterdataService.getStockData();
    const reqTax = this.masterdataService.getTaxData();
    return forkJoin([reqCustomer, reqExchangeRate, reqStock, reqTax]);
  }

  // handle duplicate file name
  checkDuplicateAttachFileName(fileName) {
    // if (!this.model.ListAttachFile) {
    //   return false;
    // }
    // const index = this.model.ListAttachFile.findIndex((currentValue) => {
    //   return currentValue.FileNameOriginal === fileName;
    // });
    // return index > -1;
  }

  // Get max Sort Order from List AttachFile
  getMaxSortOrder() {
    let maxSortOrder = Math.max.apply(Math, this.model.ListSaleOrderDetail.map(function (value) {
      return value.SortOrder;
    }));
    if (maxSortOrder === -Infinity) {
      maxSortOrder = 0;
    }
    return maxSortOrder;
  }

  changeFile(files) {
    // let imgURL: any;
    // const lstNewFile: File[] = files;
    // Array.from(lstNewFile).map((file) => {
    //
    //   if (this.checkDuplicateAttachFileName(file.name)) {
    //     this.notificationService.showInfo('Vui lòng không chọn trùng tên tập tin!');
    //     return;
    //   }
    //
    //   const attachfile: Attachfile = new Attachfile();
    //   attachfile.FileNameOriginal = file.name;
    //   attachfile.FileSize = file.size;
    //   attachfile.OptionName = 'VENDORPRODUCT';
    //
    //
    //   // Current state is EditMode
    //   if (this.currentIndexAttachFile >= 0) {
    //     // get current object AttachFile by row index
    //     const currentAttachFile = this.model.ListAttachFile[this.currentIndexAttachFile];
    //
    //     const oldAttachIndex = this.lstFileToUpload.findIndex((value) => {
    //       return value.name === currentAttachFile.FileNameOriginal;
    //     });
    //     if (oldAttachIndex > -1) {
    //       this.lstFileToUpload.splice(oldAttachIndex, 1);
    //     }
    //
    //     currentAttachFile.FileNameOriginal = attachfile.FileNameOriginal;
    //     currentAttachFile.FileSize = attachfile.FileSize;
    //     currentAttachFile.OptionName = attachfile.OptionName;
    //
    //
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //       imgURL = reader.result;
    //       currentAttachFile.FilePath = imgURL;
    //       if (Globalfunctions.checkIsImageFile(file)) {
    //         currentAttachFile.FilePathPreview = imgURL;
    //       } else {
    //         currentAttachFile.FilePathPreview = Key_DefaultAttachFile;
    //       }
    //     };
    //
    //     this.currentIndexAttachFile = -1;
    //   } else {
    //     // If current state is AddState => auto assign new SordOrder valua
    //     attachfile.SortOrder = this.getMaxSortOrder() + 1;
    //     attachfile.IsNew = true;
    //     attachfile.FilePathPreview = Key_DefaultAttachFile;
    //
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //       imgURL = reader.result;
    //       attachfile.FilePath = imgURL;
    //       if (Globalfunctions.checkIsImageFile(file)) {
    //         attachfile.FilePathPreview = imgURL;
    //       }
    //
    //       this.model.ListAttachFile.push(attachfile);
    //     };
    //   }
    //   this.lstFileToUpload.push(file);
    // });
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
// // check valid index
//     if (index < 0) {
//       return;
//     }
//
//     // get current AttachFile by index
//     const currentAttachFile = this.model.ListAttachFile[index];
//     if (!currentAttachFile) {
//       return;
//     }
//
//     // AttachFile was storage in DB, add item to list for delete from DB
//     if (currentAttachFile.AttachId > 0) {
//       if (this.model.ListAttachFileDelete === undefined || this.model.ListAttachFileDelete == null) {
//         this.model.ListAttachFileDelete = [];
//       }
//       this.model.ListAttachFileDelete.push(currentAttachFile);
//     }
//
//     // find index by filename from List File To Upload
//     const indexInListToUpload = this.lstFileToUpload.findIndex((file) => {
//       return file.name === currentAttachFile.FileNameOriginal;
//     });
//
//     // check valid index, delete from List File To Upload
//     if (indexInListToUpload > -1) {
//       this.lstFileToUpload.splice(indexInListToUpload, 1);
//     }
//
//     // delete from List AttachFile
//     this.model.ListAttachFile.splice(index, 1);
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
        const index = this.model.ListSaleOrderDetail.findIndex(x => x.ProductCode === productSelected.ProductCode);
        if (index > -1) {
          this.notificationService.showInfo('Sản phẩm đã được thêm vào danh sách! Vui lòng chọn sản phẩm khác!');
          return;
        }
        if (productSelected !== undefined && productSelected != null) {
          const invoiceDetail = new SaleInvoiceDetail();
          invoiceDetail.ProductId = productSelected.ProductId;
          invoiceDetail.ProductCode = productSelected.ProductCode;
          invoiceDetail.ProductName = productSelected.ProductName;
          invoiceDetail.UnitName = productSelected.UnitName;
          invoiceDetail.Price = productSelected.Price;
          invoiceDetail.TaxPercent = this.getTaxPercent(productSelected.TaxId);
          invoiceDetail.TaxAmount = 0;
          invoiceDetail.DiscountAmount = 0;
          invoiceDetail.TotalAmount = 0;
          invoiceDetail.SortOrder = this.getMaxSortOrder() + 1;
          this.model.ListSaleOrderDetail.push(invoiceDetail);
        }
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  // Lấy giá trị % VAT theo sản phẩm được chọn
  getTaxPercent(taxId: number) {
    const tax = this.lstTax.find(value => {
      return value.TaxId === taxId;
    });
    return tax != null ? tax.TaxPercent : 0;
  }

  confirmDeleteProduct(index) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true, size: 'sm'
    });

    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        const saleorderDetail = Object.assign({}, this.model.ListSaleOrderDetail[index]);
        this.model.ListSaleOrderDetail.splice(index, 1);
        if (saleorderDetail.SaleInvoiceDetailId > 0) {
          if (this.model.ListSaleOrderDetailDelete == null) {
            this.model.ListSaleOrderDetailDelete = [];
          }
          this.model.ListSaleOrderDetailDelete.push(saleorderDetail);
        }
        this.calcFooterSummary();
      }
    });
  }

  saveData(isContinue: boolean) {
    // const formData = new FormData();
    // Array.from(this.lstFileToUpload).map((file) => {
    //   return formData.append(file.name, file, file.name);
    // });

    if (this.model.VoucherDate != null) {
      const dt = moment(this.model.VoucherDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      if (Math.abs(dt.getTimezoneOffset()) > 0) {
        dt.setHours(dt.getHours() - Math.abs(dt.getTimezoneOffset() / 60));
      }
      this.model.VoucherDate = dt;
    }

    if (this.model.CreatedDate != null) {
      const dt = moment(this.model.CreatedDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      if (Math.abs(dt.getTimezoneOffset()) > 0) {
        dt.setHours(dt.getHours() - Math.abs(dt.getTimezoneOffset() / 60));
      }
      this.model.CreatedDate = dt;
    }

    this.service.saveData(this.model, this.isAddState).subscribe(res => {
      if (res && res.IsOk) {
        const message = (this.isAddState ? 'Thêm mới' : 'Chỉnh sửa') + ' thành công!';
        this.notificationService.showSucess(message);
        this.router.navigate(['saleorder']);
      } else {
        this.notificationService.showError(res.MessageText);
      }
    });
  }

  goBack() {
    const isEqualObject = deepEqual(this.model, this.modelBackup);
    if (!isEqualObject) {
      const modalRef = this.modalService.open(ComfirmDialogComponent, {
        backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'sm'
      });
      modalRef.componentInstance.contentMessage = 'Dữ liệu đã bị thay đổi. Bạn có muốn tiếp tục hay không?';
      // xử lý sau khi đóng dialog, thực hiện chuyển hướng trang
      modalRef.result.then((result) => {
        if (result !== undefined && result != null && result === true) {
          this.router.navigate(['saleorder']);
        }
      }, (reason) => {
        console.log(reason);
      });
    } else {
      this.router.navigate(['saleorder']);
    }
  }

  clearSaler() {
    this.model.SaleRefId = -1;
  }

  renderDataRowAutoComplete(data: Customer): string {
    const html = `
      <div class="data-row">
        <div class="col-4">${data.CustomerCode}</div>
        <div class="col-4">${data.CustomerName}</div>
      </div>`;
    return html;
  }

  autocompleteCallback(customerId) {
    const customer = this.lstCustomer.find(x => x.CustomerId === customerId);
    this.changeCustomer(customer);
  }

  clearDataCustomer() {
    this.model.CustomerId = null;
    this.model.CustomerAddress = null;
    this.model.CustomerPhone = null;
    this.model.CustomerFax = null;
    this.model.DeliveryId = -1;
    this.model.SaleRefId = -1;
  }

  changeCustomer(customer: Customer) {
    this.clearDataCustomer();
    if (customer === undefined || customer == null) {
      return;
    }
    this.model.CustomerName = customer.CustomerName;
    this.model.CustomerId = customer.CustomerId;
    this.model.CustomerCode = customer.CustomerCode;
    this.model.CustomerAddress = customer.Address;
    this.model.CustomerPhone = customer.PhoneNumber;
    this.model.CustomerFax = customer.FaxNumber;
    this.customerService.getDataDefault(customer.CustomerId).subscribe(res => {
      if (res !== undefined && res.IsOk) {
        console.log(res.RepData);
        const customerDetail = res.RepData as Customer;
        this.lstCustomerDelivery = customerDetail.objDelivery;
        this.lstCustomerSale = customerDetail.objSaler;
      }
    });
  }

  clearDelivery() {
    this.model.DeliveryId = -1;
  }

  clearCurrency() {
    this.model.CurrencyId = -1;
  }

  clearStock() {
    this.model.StockId = -1;
  }

  // tính toán dữ liệu cột Thành tiền
  calcAmount(row: SaleInvoiceDetail) {
    const saleOrderDetail = row;
    saleOrderDetail.Amount = Number((Number(saleOrderDetail.Quantity) * Number(saleOrderDetail.Price)).toFixed(2));
    this.calcTotalAmount(saleOrderDetail);
  }

  // tính toán dữ liệu cho cột Tổng tiền
  calcTotalAmount(row: SaleInvoiceDetail) {
    const saleOrderDetail = row;
    const AmountAfterDiscount = saleOrderDetail.Amount - saleOrderDetail.DiscountAmount;
    const TaxAmount = (AmountAfterDiscount * saleOrderDetail.TaxPercent) / 100;
    saleOrderDetail.TaxAmount = Number.isNaN(TaxAmount) ? 0 : TaxAmount;

    const TotalAmount = Number((Number(saleOrderDetail.Amount) + Number(saleOrderDetail.TaxAmount)).toFixed(2));
    saleOrderDetail.TotalAmount = Number.isNaN(TotalAmount) ? 0 : TotalAmount;
    this.calcFooterSummary();
  }

  // xử lý khi change tỷ giá. chú ý dữ liệu tý giá là dữ liệu mới nhất theo ngày tỷ giá
  changeCurrency(currencyId) {
    this.model.ExchangeRate = null;
    const exchangeRate = this.lstExchangeRate.find(value => {
      return value.CurrencyId === currencyId;
    });
    if (exchangeRate) {
      this.model.ExchangeRate = exchangeRate.ExchangeRating;
    }
  }

  // tính toán dữ liệu dòng Footer của table
  calcFooterSummary() {
    let Amount = 0;
    let DiscountAmount = 0;
    let TaxAmount = 0;
    let TotalAmount = 0;
    this.model.ListSaleOrderDetail.forEach(value => {
      Amount += Number(value.Amount);
      DiscountAmount += Number(value.DiscountAmount);
      TaxAmount += Number(value.TaxAmount);
      TotalAmount += Number(value.TotalAmount);
    });
    this.model.Amount = Number(Number(Amount).toFixed(2));
    this.model.DiscountAmount = Number(Number(DiscountAmount).toFixed(2));
    this.model.TaxAmount = Number(Number(TaxAmount).toFixed(2));
    this.model.TotalAmount = Number(Number(TotalAmount).toFixed(2));
  }

  resetForm() {
    const isEqualObject = deepEqual(this.model, this.modelBackup);
    if (!isEqualObject) {
      const modalRef = this.modalService.open(ComfirmDialogComponent, {
        backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'sm'
      });
      modalRef.componentInstance.contentMessage = 'Dữ liệu đã bị thay đổi. Bạn có muốn tiếp tục hay không?';
      // xử lý sau khi đóng dialog, thực hiện chuyển hướng trang
      modalRef.result.then((result) => {
        if (result !== undefined && result != null && result === true) {
          if (this.isAddState) {
            this.model = new SaleInvoice();
          } else {
            this.router.navigate(['saleorderdetail']);
          }
        }
      }, (reason) => {
      });
    } else {
      this.router.navigate(['saleorderdetail']);
    }
  }

  clearPaymentMethod() {
    this.model.PaymentMethodId = -1;
  }

  changeDelivery(id: number) {
    const deliveryInfo = this.lstCustomerDelivery.find(value => {
      return value.RowId === id;
    });
    if (deliveryInfo !== undefined && deliveryInfo != null) {
      this.model.DeliveryPlace = deliveryInfo.DeliveryPlace;
      this.model.DeliveryAddress = deliveryInfo.DeliveryAddress;
      this.model.DeliveryNotes = deliveryInfo.Notes;
      this.model.Longitude = deliveryInfo.Longitude;
      this.model.Latitude = deliveryInfo.Latitude;
    } else {
      this.model.DeliveryPlace = null;
      this.model.DeliveryAddress = null;
      this.model.DeliveryNotes = null;
      this.model.Longitude = null;
      this.model.Latitude = null;
    }
  }

  printSaleOrder() {
    // const modalRef = this.modalService.open(ReportsaleorderComponent, {
    //   backdrop: 'static', scrollable: false, centered: true, backdropClass: 'backdrop-modal', size: 'xl'
    // });
    //
    // modalRef.componentInstance.model = this.model;
    this.printReport(this.lstReportComponent, this.reportsaleorder);
  }

  ngAfterViewInit(): void {
    this.lstReportComponent.push(this.reportsaleorder);
    this.lstReportComponent.push(this.reportsaleordercancel);
  }

  setPrintComponent(component: ElementRef, isPrint: boolean) {
    if (component !== undefined) {
      if (isPrint) {
        this.renderer2.setProperty(component.nativeElement, 'id', Key_Id_PrintReport);
      } else {
        this.renderer2.setProperty(component.nativeElement, 'id', Key_Id_OtherReport);
      }
    }
  }

  printReport(lstComponent: ElementRef[], component: ElementRef) {
    lstComponent.forEach(value => {
      if (component !== value) {
        this.setPrintComponent(value, false);
      }
    });
    this.setPrintComponent(component, true);
    window.print();
  }
}
