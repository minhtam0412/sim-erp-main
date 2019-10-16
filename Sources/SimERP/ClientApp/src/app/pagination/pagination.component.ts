import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

// <app-pagination
//   [count]="someCountVar"
//   [page]="somePageVar"
//   [perPage]="somePerPageVar"
//   [pagesToShow]="5"
//   [loading]="someLoadingVar"
//   (onPrev)="prevPage()"
//   (onNext)="nextPage()"
//   (onPage)="goToPage($event)">
// </app-pagination>

export class PaginationComponent implements OnInit {
  @Input() page: number; // the current page
  @Input() count: number; // how many total items there are in all pages
  @Input() perPage: number; // how many items we want to show per page
  @Input() pagesToShow: number; // how many pages between next/prev
  @Input() loading: boolean; // check if content is being loaded


  @Output() goPrev = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();
  @Output() goPage = new EventEmitter<number>();
  @Output() changeLimit = new EventEmitter<number>();

  myForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.myForm = new FormGroup({
      limit: new FormControl(10),
    });
  }

  getLimit() {
    return this.myForm.getRawValue().limit;
  }

  getMin(): number {
    return ((this.perPage * this.page) - this.perPage) + 1;
  }

  getMax(): number {
    let max = this.perPage * this.page;
    if (max > this.count) {
      max = this.count;
    }
    return max;
  }

  onPage(n: number): void {
    this.goPage.emit(n);
  }

  onChangeLimit() {
    this.perPage = this.getLimit();
    this.changeLimit.emit();
  }

  onPrev(): void {
    this.goPrev.emit(true);
  }

  onNext(next: boolean): void {
    this.goNext.emit(next);
  }

  totalPages(): number {
    return Math.ceil(this.count / this.perPage) || 0;
  }

  lastPage(): boolean {
    return this.perPage * this.page > this.count || this.getPages().length == 1;
  }

  getPages(): number[] {
    const c = Math.ceil(this.count / this.getLimit());
    const p = this.page || 1;
    const pagesToShow = this.pagesToShow || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }
}
