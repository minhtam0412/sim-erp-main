import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendortypeComponent } from './vendortype.component';

describe('VendortypeComponent', () => {
  let component: VendortypeComponent;
  let fixture: ComponentFixture<VendortypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendortypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendortypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
