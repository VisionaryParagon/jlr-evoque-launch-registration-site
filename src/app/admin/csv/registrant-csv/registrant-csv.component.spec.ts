import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrantCsvComponent } from './registrant-csv.component';

describe('RegistrantCsvComponent', () => {
  let component: RegistrantCsvComponent;
  let fixture: ComponentFixture<RegistrantCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrantCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrantCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
