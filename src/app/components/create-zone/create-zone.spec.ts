import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateZone } from './create-zone';

describe('CreateZone', () => {
  let component: CreateZone;
  let fixture: ComponentFixture<CreateZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
