import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: ToastrService) {
  }

  static getTitleContent(title?: string) {
    return title === undefined || title === null ? 'Thông báo' : title;
  }

  showSucess(content: string, title?: string) {
    this.toastrService.success(content, NotificationService.getTitleContent(title));
  }

  showInfo(content: string, title?: string) {
    this.toastrService.info(content, NotificationService.getTitleContent(title));
  }

  showError(content: string, title?: string) {
    this.toastrService.error(content, NotificationService.getTitleContent(title));
  }
}
