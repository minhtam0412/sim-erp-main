import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpermissionComponent } from './userpermission.component';

describe('UserpermissionComponent', () => {
  let component: UserpermissionComponent;
  let fixture: ComponentFixture<UserpermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
