import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrantFormComponent } from './registrant-form.component';

describe('RegistrantFormComponent', () => {
  let component: RegistrantFormComponent;
  let fixture: ComponentFixture<RegistrantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
