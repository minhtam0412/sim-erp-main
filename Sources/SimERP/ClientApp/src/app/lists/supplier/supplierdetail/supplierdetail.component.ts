import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../common/notifyservice/notification.service';
import {UploadfileService} from '../../../common/uploadfile/uploadfile.service';
import {LoaderService} from '../../../common/loading/loader.service';
import {SupplierService} from '../supplier.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-supplierdetail',
  templateUrl: './supplierdetail.component.html',
  styleUrls: ['./supplierdetail.component.css']
})
export class SupplierdetailComponent implements OnInit {

  model: {};

  constructor(private notificationService: NotificationService, private service: SupplierService,
              private uploadfileService: UploadfileService, public loaderService: LoaderService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.activatedRoute.snapshot.params);
  }

  changeFile(files: FileList) {

  }

  openAttachFile(row: any) {

  }

  setCurrentAttachFileIndex(i: number) {

  }

  deleteAttachFile(i: number) {

  }
}
