import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {ROOT_URL} from '../config/APIURLconfig';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {
  progress: number;
  message = '';

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.baseUrl = ROOT_URL;
  }

  uploadProductFile(formData) {
    this.httpClient.post(this.baseUrl + 'api/uploadproductfile', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          console.log(this.progress);
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          console.log(event.body);
          // this.onUploadFinished.emit(event.body);
        }
      });
  }
}
