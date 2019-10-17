import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Function} from '../../pagelist/model/Function';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {PaginationComponent} from '../../../pagination/pagination.component';
import {ProductdetailComponent} from '../productdetail/productdetail.component';
import {MasterdataService} from '../../../common/masterdata/masterdata.service';
import {Country} from '../../country/model/country';
import {Packageunit} from '../../packageunit/model/packageunit';
import {Observable} from 'rxjs/internal/Observable';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {ResponeResult} from '../../../common/commomodel/ResponeResult';
import {Unit} from '../../unitcomponent/model/Unit';
import {Tax} from '../../taxcomponent/models/Tax';
import {ProductCategory} from '../../productcategory/model/ProductCategory';
import {ProductService} from '../product.service';
import {Product} from '../model/product';
import {Vendor} from '../../vendor/model/vendor';
import {Guid} from 'guid-typescript';
import {ProductCategoryService} from '../../productcategory/product-category.service';
import {DropDowTree} from '../../productcategory/model/dropdowntree';
import {ComfirmDialogComponent} from '../../../common/comfirm-dialog/comfirm-dialog.component';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {ListStatus} from '../../../common/masterdata/commondata';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit, AfterViewInit {

  constructor(private service: ProductService, private modalService: NgbModal, private toastr: ToastrService,
              private masterdataService: MasterdataService, private  productCategoryService: ProductCategoryService,
              private  notificationService: NotificationService) {
    this.objModel = new Product();
    this.searchString = '';
    this.isActive = -1;
    this.productCategory = undefined;

    this.loadCommonData().subscribe(res => {
      this.lstCountry = (res[0] as ResponeResult).RepData;
      this.lstPackageUnit = (res[1] as ResponeResult).RepData;
      this.lstVendor = (res[2] as ResponeResult).RepData;
      this.lstUnit = (res[3] as ResponeResult).RepData;
      this.lstTax = (res[4] as ResponeResult).RepData;
      this.lstProductCategory = (res[5] as ResponeResult).RepData;
    });
  }

  searchString: string;
  isActive = -1;
  productCategory: Guid = undefined;
  lstDataResult: Product[] = [];
  lstFunction: Function[] = [];
  objModel: Product;
  lstCountry: Country[];
  lstPackageUnit: Packageunit[];
  lstVendor: Vendor[];
  lstUnit: Unit[];
  lstTax: Tax[];
  lstProductCategory: ProductCategory[];

  lstDataDropDown: ProductCategory[] = [];
  lstStatus = ListStatus;


  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, {static: true}) pagingComponent: PaginationComponent;

  static checkIssueParen(array: ProductCategory[], parenID: Guid) {
    for (let i = 0; i < array.length; ++i) {
      if (array[i].ParentId === parenID) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
  }

  loadDataDropDown() {
    this.productCategoryService.getAllData().subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstDataDropDown = res.RepData;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.InitDropdown();
        }
      }
    );
  }

  InitDropdown() {
    const dataDropDown = this.getListDropDownTree();
    $(document).ready(function () {
      $('#dropdowntree').kendoDropDownTree({
        placeholder: 'Tất cả',
        height: 'auto',
        dataSource: dataDropDown,
      });
    });

  }

  getListDropDownTree() {

    const listItemLever = [];

    this.lstDataDropDown.forEach(element => {

      if (element.ParentId == null) {
        const subitem = new DropDowTree();
        subitem.text = element.ProductCategoryName;
        subitem.value = element.ProductCategoryId;

        subitem.items = this.getListSubItemLever(this.lstDataDropDown, element.ProductCategoryId);

        listItemLever.push(subitem);
      }
    });
    return listItemLever;
  }

  getListSubItemLever(array: ProductCategory[], parenID: Guid) {

    const listSubItem: DropDowTree[] = [];

    array.forEach(element => {
      if (element.ParentId === parenID) {

        const subitem = new DropDowTree();
        subitem.text = element.ProductCategoryName;
        subitem.value = element.ProductCategoryId;

        if (ProductlistComponent.checkIssueParen(array, element.ProductCategoryId)) {
          subitem.items = this.getListSubItemLever(array, element.ProductCategoryId);
        }
        listSubItem.push(subitem);
      }
    });

    return listSubItem;
  }

  loadCommonData(): Observable<any[]> {
    const reqCountry = this.masterdataService.getCountryData();
    const reqPackageUnit = this.masterdataService.getPackageUnitData();
    const reqVendor = this.masterdataService.getVendorData();
    const reqUnit = this.masterdataService.getUnitData();
    const reqTax = this.masterdataService.getTaxData();
    const reqProductCategory = this.masterdataService.getProductCategoryData();
    return forkJoin([reqCountry, reqPackageUnit, reqVendor, reqUnit, reqTax, reqProductCategory]);
  }

  SearchAction() {
    this.page = 1;
    this.LoadData(0);
  }

  showConfirmDeleteDialog(row: Product) {
    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result && result === true) {
        this.deleteData(row);
      }
    });
  }

  // mở dialog insert/update
  showDialog(productId?: any) {
    const modalRef = this.modalService.open(ProductdetailComponent, {
      backdrop: 'static', scrollable: true, centered: true, backdropClass: 'backdrop-modal', size: 'xl'
    });

    modalRef.componentInstance.lstCountry = this.lstCountry;
    modalRef.componentInstance.lstPackageUnit = this.lstPackageUnit;
    modalRef.componentInstance.lstVendor = this.lstVendor;
    modalRef.componentInstance.lstUnit = this.lstUnit;
    modalRef.componentInstance.lstTax = this.lstTax;
    modalRef.componentInstance.lstProductCategory = this.lstProductCategory;
    if (productId === undefined || productId == null) {
      modalRef.componentInstance.isAddState = true;
    } else {
      modalRef.componentInstance.isAddState = false;
      modalRef.componentInstance.productId = productId;
    }

    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result !== undefined && result === true) {
        console.log(result);
        const startRow = this.getStartRow();
        this.LoadData(startRow);
      }
    }, (reason) => {
      console.log(reason);
    });
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    const dropdowntree = $('#dropdowntree').data('kendoDropDownTree');
    this.productCategory = undefined;
    if (dropdowntree !== undefined) {
      const select = dropdowntree.value();
      if (select != null) {
        this.productCategory = select;
      }
    }

    this.service.getData(this.searchString, Number(this.isActive) === -1 ? null : Number(this.isActive),
      this.productCategory, startRow, limit).subscribe(
      {
        next: (res) => {
          if (!res.IsOk) {
            this.toastr.error(res.MessageText, 'Thông báo!');
          } else {
            this.lstDataResult = res.RepData;
            this.total = res.TotalRow;
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

  getStartRow(): number {
    return (this.page - 1) * this.pagingComponent.getLimit();
  }

  ngAfterViewInit(): void {
    this.loadDataDropDown();
    this.SearchAction();

  }

  goToPage(n: number): void {
    this.page = n;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  changeLimit() {
    this.page = 1;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  onNext(): void {
    this.page++;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  onPrev(): void {
    this.page--;
    const startRow = this.getStartRow();
    this.LoadData(startRow);
  }

  private deleteData(row: Product) {
    this.service.deleteData(row).subscribe(res => {
      if (res && res.IsOk && res.RepData === true) {
        this.notificationService.showSucess('Xoá thành công!');
        this.SearchAction();
      } else {
        this.toastr.error('Lỗi xoá thông tin!');
      }
    }, err => {
      console.log(err);
      this.toastr.error('Lỗi xoá thông tin! Vui lòng liên hệ quản trị hệ thống!');
    });
  }

  clearIsActive() {
    this.isActive = -1;
  }

}
