import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedetailinfoComponent } from './purchasedetailinfo.component';

describe('PurchasedetailinfoComponent', () => {
  let component: PurchasedetailinfoComponent;
  let fixture: ComponentFixture<PurchasedetailinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasedetailinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedetailinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
