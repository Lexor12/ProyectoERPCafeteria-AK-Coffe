import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhComponent } from './rh.component/rh.component';

describe('RhComponent', () => {
  let component: RhComponent;
  let fixture: ComponentFixture<RhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RhComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RhComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
