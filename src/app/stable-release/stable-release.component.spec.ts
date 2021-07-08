import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StableReleaseComponent } from './stable-release.component';

describe('StableReleaseComponent', () => {
  let component: StableReleaseComponent;
  let fixture: ComponentFixture<StableReleaseComponent>;

  beforeEach(waitForAsync(() => {
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
