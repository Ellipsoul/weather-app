import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWeatherComponent } from './live-weather.component';

describe('LiveWeatherComponent', () => {
  let component: LiveWeatherComponent;
  let fixture: ComponentFixture<LiveWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveWeatherComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
