import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveCsvComponent } from './wave-csv.component';

describe('WaveCsvComponent', () => {
  let component: WaveCsvComponent;
  let fixture: ComponentFixture<WaveCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
