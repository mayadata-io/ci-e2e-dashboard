import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayastorComponent } from './mayastor.component';

describe('MayastorComponent', () => {
  let component: MayastorComponent;
  let fixture: ComponentFixture<MayastorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayastorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MayastorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
