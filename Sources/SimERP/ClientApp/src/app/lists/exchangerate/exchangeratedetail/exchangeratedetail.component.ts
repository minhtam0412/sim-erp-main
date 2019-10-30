import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {ExchangeRate} from '../model/exchangerate';
import {ExchangerateService} from '../exchangerate.service';
import {Currency} from '../../currency/model/currency';
import {BsDatepickerConfig} from 'ngx-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-exchangeratedetail',
  templateUrl: './exchangeratedetail.component.html',
  styleUrls: ['./exchangeratedetail.component.css']
})
export class ExchangeratedetailComponent implements OnInit {

  @Input() isAddState = true;
  @Input() rowSelected: ExchangeRate;
  @Input() bsConfig: Partial<BsDatepickerConfig>;
  resultCloseDialog = false;
  model: ExchangeRate;
  @Input() lstCurrency: Currency[];

  constructor(private activeModal: NgbActiveModal, private notificationService: NotificationService,
              private service: ExchangerateService) {
  }

  ngOnInit() {
    if (this.isAddState) {
      this.model = new ExchangeRate();
    } else {
      this.model = this.rowSelected;
      if (this.model.ExchangeDate != null) {
        this.model.ExchangeDate = moment(this.model.ExchangeDate, 'YYYY-MM-DDTHH:mm:ssZ').toDate();
      }
    }
  }

  closeDialog() {
    this.activeModal.close(this.resultCloseDialog);
  }

  getActionText() {
    return this.isAddState ? 'Thêm mới ' : 'Cập nhật ';
  }

  saveData(isContinue: boolean) {
    this.model.ExchangeDate = moment.utc(this.model.ExchangeDate).local().toDate();
    this.service.saveData(this.model, this.isAddState).subscribe({
      next: (res) => {
        if (res.IsOk) {
          this.notificationService.showSucess(this.getActionText() + 'thành công');
          this.resultCloseDialog = true;
          if (this.isAddState) {
            if (isContinue) {
              this.model = new ExchangeRate();
            } else {
              this.closeDialog();
            }
          } else {
            if (isContinue) {
              this.isAddState = true;
              this.model = new ExchangeRate();
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

  clearCurrencyId() {

  }
}
