import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasemanagementComponent } from './purchasemanagement.component';

describe('PurchasemanagementComponent', () => {
  let component: PurchasemanagementComponent;
  let fixture: ComponentFixture<PurchasemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
