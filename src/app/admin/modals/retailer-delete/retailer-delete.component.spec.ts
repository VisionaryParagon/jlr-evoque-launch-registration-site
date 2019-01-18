import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerDeleteComponent } from './retailer-delete.component';

describe('RetailerDeleteComponent', () => {
  let component: RetailerDeleteComponent;
  let fixture: ComponentFixture<RetailerDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
