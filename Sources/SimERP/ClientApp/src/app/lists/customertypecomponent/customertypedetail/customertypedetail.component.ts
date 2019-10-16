import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerType} from '../models/customertype';
import {CustomertypeService} from '../customertype.service';
import {NotificationService} from '../../../common/notifyservice/notification.service';

@Component({
  selector: 'app-customertypedetail',
  templateUrl: './customertypedetail.component.html',
  styleUrls: ['./customertypedetail.component.css']
})
export class CustomertypedetailComponent implements OnInit {
  @Input() isAddState = true;
  @Input() rowSelected: CustomerType;
  private resultCloseDialog = false;
  model: CustomerType;

  constructor(private activeModal: NgbActiveModal, private notificationService: NotificationService, private cusTypeService: CustomertypeService) {
  }

  ngOnInit() {
    if (this.isAddState) {
      this.model = new CustomerType();
    } else {
      this.model = this.rowSelected;
    }
  }

  closeDialog() {
    this.activeModal.close(this.resultCloseDialog);
  }

  getActionText() {
    return this.isAddState ? 'Thêm mới ' : 'Cập nhật ';
  }

  saveData(isContinue: boolean) {
    console.log(JSON.stringify(this.model));
    if (this.isAddState) {
      this.model.CreatedDate = new Date();
    } else {
      this.model.ModifyDate = new Date();
    }
    this.cusTypeService.saveCustomerType(this.model, this.isAddState).subscribe({
      next: (res) => {
        if (res.IsOk) {
          this.notificationService.showSucess(this.getActionText() + 'thành công');
          this.resultCloseDialog = true;
          if (this.isAddState) {
            if (isContinue) {
              this.model = new CustomerType();
            } else {
              this.closeDialog();
            }
          } else {
            if (isContinue) {
              this.isAddState = true;
              this.model = new CustomerType();
            } else {
              this.closeDialog();
            }
          }
        } else {
          this.notificationService.showError(res.MessageText, 'Thông báo');
        }
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(err, 'Thông báo');
        this.resultCloseDialog = false;
      }, complete: () => {
      }
    });
  }
}
