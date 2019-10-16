import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LoaderService} from '../../common/loading/loader.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-home-layout',
  template: `
      <app-loading *ngIf="loaderService.isLoading$ | async"></app-loading>
      <div class='supperbody'>
          <div class='main_header'>
              <app-header></app-header>
          </div>
          <div>
              <router-outlet></router-outlet>
          </div>
      </div>
  `,
  styles: [],
})
export class HomeLayoutComponent implements OnInit, AfterViewInit {
  constructor(public loaderService: LoaderService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    $('#main-menu').smartmenus({
      subMenusSubOffsetX: 1,
      subMenusSubOffsetY: -8
    });
  }
}
