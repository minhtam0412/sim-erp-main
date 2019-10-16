import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.css']
})
export class ComfirmDialogComponent implements OnInit {

  @Input() contentMessage: string;
  constructor(public activeModal: NgbActiveModal) {
    if (this.contentMessage == null || this.contentMessage == "" || this.contentMessage == undefined) {
      this.contentMessage = "Bạn có muốn xóa dữ liệu không?";
    }
  }

  ngOnInit() {
  }

  saveData(flag: boolean) {
    this.activeModal.close(flag);
    
  }
}
