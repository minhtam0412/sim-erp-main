import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

declare var $: any;

@Component({
  selector: 'app-root',
  template: `
      <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  isLogin = false;

  constructor(private changeDetectorRefs: ChangeDetectorRef, private  cookieService: CookieService) {
  }

  login() {
    if (localStorage.getItem('SIMERP_LOGINEDUSER')) {
      this.isLogin = true;
      this.changeDetectorRefs.detectChanges();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('SIMERP_LOGINEDUSER')) {
      this.isLogin = true;
    }
    // when browser closed - psedocode
    // $(window).unload(function () {
    //   localStorage.clear();
    // });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.cookieService.delete('asd');
  }

}
