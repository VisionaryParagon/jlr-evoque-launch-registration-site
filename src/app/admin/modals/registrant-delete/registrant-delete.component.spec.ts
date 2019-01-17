import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrantDeleteComponent } from './registrant-delete.component';

describe('RegistrantDeleteComponent', () => {
  let component: RegistrantDeleteComponent;
  let fixture: ComponentFixture<RegistrantDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrantDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrantDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
