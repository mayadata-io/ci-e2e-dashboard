import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnersPageComponent } from './runners-page.component';

describe('RunnersPageComponent', () => {
  let component: RunnersPageComponent;
  let fixture: ComponentFixture<RunnersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
