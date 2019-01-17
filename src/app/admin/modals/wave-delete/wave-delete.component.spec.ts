import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveDeleteComponent } from './wave-delete.component';

describe('WaveDeleteComponent', () => {
  let component: WaveDeleteComponent;
  let fixture: ComponentFixture<WaveDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
