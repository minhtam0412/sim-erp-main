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
import {VendorType} from '../../vendortype/model/vendortype';
import {Unit} from '../../unitcomponent/model/Unit';
import {Tax} from '../../taxcomponent/models/Tax';
import {ProductCategory} from '../../productcategory/model/ProductCategory';
import {ProductService} from '../product.service';
import {Product} from '../model/product';
import {Vendor} from '../../vendor/model/vendor';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit, AfterViewInit {

  searchString: string;
  cboIsActive: number;
  productCategory: number;
  lstDataResult: Product[] = [];
  lstFunction: Function[] = [];
  objModel: Product;
  isNewModel: boolean;
  lstCountry: Country[];
  lstPackageUnit: Packageunit[];
  lstVendor: Vendor[];
  lstUnit: Unit[];
  lstTax: Tax[];
  lstProductCategory: ProductCategory[];


  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, {static: true}) pagingComponent: PaginationComponent;

  constructor(private service: ProductService, private modalService: NgbModal, private toastr: ToastrService,
              private masterdataService: MasterdataService) {
    this.objModel = new Product();
    this.cboIsActive = -1;
    this.searchString = '';
    this.productCategory = -1;

    this.loadCommonData().subscribe(res => {
      console.log(res);
      this.lstCountry = (res[0] as ResponeResult).RepData;
      this.lstPackageUnit = (res[1] as ResponeResult).RepData;
      this.lstVendor = (res[2] as ResponeResult).RepData;
      this.lstUnit = (res[3] as ResponeResult).RepData;
      this.lstTax = (res[4] as ResponeResult).RepData;
      this.lstProductCategory = (res[5] as ResponeResult).RepData;
    });
  }

  ngOnInit() {
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
    });
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.service.getData(this.searchString, this.cboIsActive, startRow, limit).subscribe(
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


  checkValidateModel() {
    return true;
  }


  EditModel(index: number) {
    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];
  }

  SearchData() {
    this.page = 1;
    this.LoadData(0);
  }

  getStartRow(): number {
    const startRow = (this.page - 1) * this.pagingComponent.getLimit();
    return startRow;
  }

  ngAfterViewInit(): void {
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

}
