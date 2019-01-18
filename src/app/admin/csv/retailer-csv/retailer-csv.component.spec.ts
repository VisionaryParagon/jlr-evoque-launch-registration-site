import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerCsvComponent } from './retailer-csv.component';

describe('RetailerCsvComponent', () => {
  let component: RetailerCsvComponent;
  let fixture: ComponentFixture<RetailerCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
