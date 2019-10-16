import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../common/loading/loader.service';

@Component({
  selector: 'app-login-layout',
  template: `
      <app-loading *ngIf="loaderService.isLoading$ | async"></app-loading>
      <router-outlet></router-outlet>
  `,
  styles: []
})
export class LoginLayoutComponent {
  constructor(public loaderService: LoaderService) {

  }
}
