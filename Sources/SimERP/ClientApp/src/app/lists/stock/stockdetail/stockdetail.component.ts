import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {CustomertypeService} from '../../customertypecomponent/customertype.service';
import {Stock} from '../model/stock';
import {StockService} from '../stock.service';

@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.css']
})
export class StockdetailComponent implements OnInit {

  @Input() isAddState = true;
  @Input() rowSelected: Stock;
  private resultCloseDialog = false;
  model: Stock;

  constructor(private activeModal: NgbActiveModal, private notificationService: NotificationService,
              private service: StockService) {
  }

  ngOnInit() {
    if (this.isAddState) {
      this.model = new Stock();
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
              this.model = new Stock();
            } else {
              this.closeDialog();
            }
          } else {
            if (isContinue) {
              this.isAddState = true;
              this.model = new Stock();
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
