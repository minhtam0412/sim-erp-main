import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TaxService} from '../tax.service';
import {Tax} from '../models/Tax';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-taxinfo',
  templateUrl: './taxinfo.component.html',
  styleUrls: ['./taxinfo.component.css']
})
export class TaxinfoComponent implements OnInit {

  taxForm: FormGroup; // thể hiện của Form quản lý các control
  @Input() isAddState = true; // biến thể hiện trạng thái của Form (insert or| update)
  @Input() rowSelected: Tax; // dữ liệu được chọn ở lưới truyền qua từ parent
  tax: Tax; // đối tượng lưu trữ tạm ở component này
  resultCloseDialog = false; // biến xác định khi close dialog, khi trở về màn hình danh sách có cần load lại danh sách hay không

  constructor(public activeModal: NgbActiveModal, private taxService: TaxService, private toastr: ToastrService) {

  }

  ngOnInit() {
    // khởi tạo các control nghiệp vụ
    this.taxForm = new FormGroup({
      TaxCode: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      TaxName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      TaxPercent: new FormControl(0, [Validators.required, Validators.maxLength(50), Validators.min(0), Validators.max(100)]),
      Notes: new FormControl('', [Validators.maxLength(500)]),
      TaxId: new FormControl(0), // default value
      IsActive: new FormControl(true),
    });

    // chế độ update state
    if (!this.isAddState) {
      // disable control TaxCode ở chế độ Update
      const control = this.taxForm.get('TaxCode');
      control.disable();

      // cập nhật lại dữ liệu Tax lên giao diện
      this.taxForm.patchValue(this.rowSelected);
    }
  }

  // lấy câu thông báo
  getActionText() {
    return this.isAddState ? 'Thêm mới' : 'Cập nhật';
  }

  // xử lý trả dữ liệu về parent khi close dialog
  closeDialog() {
    this.activeModal.close(this.resultCloseDialog);
  }

  // xử lý lưu dữ liệu Insert/Update
  saveData(isContinue: boolean) {
    const isNew = this.isAddState;
    this.tax = Object.assign({}, this.taxForm.getRawValue());
    if (this.tax !== undefined) {
      if (isNew) {
        this.tax.CreatedDate = new Date();
      } else {
        this.tax.ModifyDate = new Date();
        this.tax.CreatedDate = this.rowSelected.CreatedDate;
        this.tax.CreatedBy = this.rowSelected.CreatedBy;
        this.tax.SortOrder = this.rowSelected.SortOrder;
      }
      this.taxService.SaveTax(this.tax, isNew).subscribe(res => {
        if (res !== undefined) {
          if (res.IsOk) {
            this.toastr.success(this.getActionText() + ' thành công');
            this.resultCloseDialog = true;
            if (isContinue) {
              this.isAddState = true;
              this.taxForm.reset(new Tax());
              this.taxForm.get('TaxCode').enable();
            } else {
              this.closeDialog();
            }
          } else {
            this.toastr.error(this.getActionText() + ' thất bại. ' + res.MessageText);
            console.log(res);
          }
        } else {
          this.toastr.error(this.getActionText() + ' thất bại');
        }
      });
    }
  }

}
