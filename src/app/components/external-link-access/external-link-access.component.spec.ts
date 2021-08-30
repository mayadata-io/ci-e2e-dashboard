import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkAccessComponent } from './external-link-access.component';

describe('ExternalLinkAccessComponent', () => {
  let component: ExternalLinkAccessComponent;
  let fixture: ComponentFixture<ExternalLinkAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLinkAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLinkAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
