import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { ComfirmDialogComponent } from '../../../common/comfirm-dialog/comfirm-dialog.component';
import { ProductCategory } from '../model/ProductCategory';
import { ProductCategoryService } from '../product-category.service';
import { DropDowTree } from '../model/dropdowntree';
import { Guid } from 'guid-typescript';


declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  dataSerach: string;
  cboIsActive: number;
  lstDataResult: ProductCategory[] = [];
  lstDataDropDown: ProductCategory[] = [];
  objModel: ProductCategory;
  isNewModel: boolean;

  total = 10;
  page = 1;
  limit = 15;

  @ViewChild(PaginationComponent, { static: true }) pagingComponent: PaginationComponent;
  @ViewChild('closeAddExpenseModal', { static: true }) closeAddExpenseModal: ElementRef;

  constructor(private apiService: ProductCategoryService, private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal, private toastr: ToastrService) {
    this.objModel = new ProductCategory();
    this.cboIsActive = -1;
    this.dataSerach = "";

  }

  ngOnInit() {
    this.loadDataDropDown();
  }

  loadDataDropDown() {
    this.apiService.getAllData().subscribe(
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

  checkIssueParen(array: ProductCategory[], parenID: Guid) {
    for (var i = 0; i < array.length; ++i) {
      if (array[i].ParentId == parenID)
        return true;
    }
    return false;
  }

  FindParenItem(array: ProductCategory[], ID: Guid) {
    for (var i = 0; i < array.length; ++i) {
      if (array[i].ProductCategoryId == ID)
        return array[i].ParentId;
    }
    return null;
  }

  getListSubItemLever(array: ProductCategory[], parenID: Guid) {

    var listSubItem: DropDowTree[] = [];

    array.forEach(element => {
      if (element.ParentId == parenID) {

        var subitem = new DropDowTree();
        subitem.text = element.ProductCategoryName;
        subitem.value = element.ProductCategoryId;

        if (this.checkIssueParen(array, element.ProductCategoryId)) {
          subitem.items = this.getListSubItemLever(array, element.ProductCategoryId);
        }
        listSubItem.push(subitem);
      }
    });

    return listSubItem;
  }

  getRootPathIdItem(array: ProductCategory[], ID: Guid) {

    var str_path = "";
    str_path += ID + ";";
    var parenID = this.FindParenItem(array, ID);
    str_path += (parenID == null ? "" : parenID);
    while (parenID != null) {
      parenID = this.FindParenItem(array, parenID);
      str_path += (parenID == null ? "" : ";" + parenID);
    }

    if (str_path != null && str_path != "") {
      var str = "";
      var str_arr: string[] = [];
      str_arr = str_path.split(';');

      if (str_arr.length > 0) {
        for (var i = str_arr.length - 1; i >= 0; --i) {
          if (str_arr[i] != null && str_arr[i] != "") {
            str += str_arr[i];
            str += (i == 0 ? "" : ";");
          }
        }
      }
      str_path = str;
    }

    return str_path;
  }

  getListDropDownTree() {

    var listItemLever = [];

    this.lstDataDropDown.forEach(element => {

      if (element.ParentId == null) {
        var subitem = new DropDowTree();
        subitem.text = element.ProductCategoryName;
        subitem.value = element.ProductCategoryId;

        subitem.items = this.getListSubItemLever(this.lstDataDropDown, element.ProductCategoryId);

        listItemLever.push(subitem);
      }
    });
    console.log(listItemLever);
    return listItemLever;
  }

  InitDropdown() {
    var dataDropDown = this.getListDropDownTree();
    $(document).ready(function () {
      $("#dropdowntree").kendoDropDownTree({
        placeholder: "-- Chọn --",
        height: "auto",
        dataSource: dataDropDown,
        //select: function (e) {
        //  var value = this.value();
        //  this.objModel.ParentId = this.value();
        //}
      });
    });

  }

  SerachAction() {
    this.page = 1;
    this.LoadData(0);
  }

  AddModel() {
    this.isNewModel = true;
  }

  LoadData(startRow: number) {
    const limit = this.pagingComponent.getLimit();
    this.spinnerService.show();
    this.apiService.getData(this.dataSerach, this.cboIsActive, startRow, limit).subscribe(
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
          this.spinnerService.hide();
        }
      }
    );
  }

  saveDataModel(isclose: boolean) {
    // get the value of the dropdowntree.
    var dropdowntree = $("#dropdowntree").data("kendoDropDownTree");
    var select = dropdowntree.value();
    this.objModel.ParentId = select;
    // get string parenlist
    if (select != null && select != "")
      this.objModel.ParentListId = this.getRootPathIdItem(this.lstDataDropDown, this.objModel.ParentId);

    //------------------------------
    this.apiService.Insert(this.objModel, this.isNewModel).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.SearchData();
          this.loadDataDropDown();
          this.clearModel();
          this.toastr.success(this.isNewModel ? 'Thêm dữ liệu thành công' : 'Dữ liệu đã được chỉnh sửa', 'Thông báo!');
          if (isclose) {
            this.closeAddExpenseModal.nativeElement.click();
          }
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  clearModel() {
    this.objModel = new ProductCategory();
    //----Defaule select value------
    var dropdowntree = $("#dropdowntree").data("kendoDropDownTree");
    dropdowntree.value("");
    dropdowntree.trigger("change");
  }

  CloseModel() {
    this.clearModel();
  }

  openDialog(id: number) {

    const modalRef = this.modalService.open(ComfirmDialogComponent, {
      backdrop: false, scrollable: true, centered: true
    });
    // xử lý sau khi đóng dialog, thực hiện load lại dữ liệu nếu muốn
    modalRef.result.then((result) => {
      if (result != undefined && result == true) {
        this.deleteRowGird(this.lstDataResult[id].ProductCategoryId);

      }
    });
  }

  deleteRowGird(id: any) {

    this.apiService.Delete(id).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.toastr.warning('Dữ liệu đã được xóa', 'Thông báo!');
          this.SearchData();
          this.loadDataDropDown();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  actionUp(index: number) {
    if (index == 0) return;
    var objcusr: any = this.lstDataResult[index].ProductCategoryId;
    var objUp: any = this.lstDataResult[index - 1].ProductCategoryId;

    this.apiService.SortOrder(objcusr, objUp).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.SearchData();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });

  }

  actionDow(index: number) {
    if (index == this.lstDataResult.length - 1) return;

    var objcusr: any = this.lstDataResult[index].ProductCategoryId;
    var objDow: any = this.lstDataResult[index + 1].ProductCategoryId;

    this.apiService.SortOrder(objDow, objcusr).subscribe(res => {
      if (res !== undefined) {
        if (!res.IsOk) {
          this.toastr.error(res.MessageText, 'Thông báo!');
        } else {
          this.SearchData();
        }
      } else {
        this.toastr.error("Lỗi xử lý hệ thống", 'Thông báo!');
      }
    }, err => {
      console.log(err);
    });
  }

  EditModel(index: number) {
    this.isNewModel = false;
    this.objModel = this.lstDataResult[index];

    //----Defaule select value------
    var dropdowntree = $("#dropdowntree").data("kendoDropDownTree");
    dropdowntree.value(this.objModel.ParentId);
    dropdowntree.trigger("change");
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
    this.SearchData();
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
