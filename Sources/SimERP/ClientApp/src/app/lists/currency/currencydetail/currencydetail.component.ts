import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {Currency} from '../model/currency';
import {CurrencyService} from '../currency.service';

@Component({
  selector: 'app-currencydetail',
  templateUrl: './currencydetail.component.html',
  styleUrls: ['./currencydetail.component.css']
})
export class CurrencydetailComponent implements OnInit {

  @Input() isAddState = true;
  @Input() rowSelected: Currency;
  private resultCloseDialog = false;
  model: Currency;

  constructor(private activeModal: NgbActiveModal, private notificationService: NotificationService,
              private service: CurrencyService) {
  }

  ngOnInit() {
    if (this.isAddState) {
      this.model = new Currency();
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
    this.service.saveData(this.model, this.isAddState).subscribe({
      next: (res) => {
        if (res.IsOk) {
          this.notificationService.showSucess(this.getActionText() + 'thành công');
          this.resultCloseDialog = true;
          if (this.isAddState) {
            if (isContinue) {
              this.model = new Currency();
            } else {
              this.closeDialog();
            }
          } else {
            if (isContinue) {
              this.isAddState = true;
              this.model = new Currency();
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
