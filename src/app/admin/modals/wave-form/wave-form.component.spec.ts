import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveFormComponent } from './wave-form.component';

describe('WaveFormComponent', () => {
  let component: WaveFormComponent;
  let fixture: ComponentFixture<WaveFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
