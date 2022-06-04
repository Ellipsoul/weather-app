import { Component, Input, OnInit } from '@angular/core';
import { WeatherLiveResponse } from 'src/app/services/weatherapi.service';

@Component({
  selector: 'app-live-weather',
  templateUrl: './live-weather.component.html',
  styleUrls: ['./live-weather.component.css'],
})
export class LiveWeatherComponent implements OnInit {
  // Live Weather data retrieved from parent
  @Input() liveWeatherData: WeatherLiveResponse | undefined;
  constructor() { }

  ngOnInit(): void {
  }
}
