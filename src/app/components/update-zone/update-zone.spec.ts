import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateZone } from './update-zone';

describe('UpdateZone', () => {
  let component: UpdateZone;
  let fixture: ComponentFixture<UpdateZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
