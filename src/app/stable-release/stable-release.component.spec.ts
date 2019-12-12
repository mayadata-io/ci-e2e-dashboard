import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StableReleaseComponent } from './stable-release.component';

describe('StableReleaseComponent', () => {
  let component: StableReleaseComponent;
  let fixture: ComponentFixture<StableReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StableReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StableReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
