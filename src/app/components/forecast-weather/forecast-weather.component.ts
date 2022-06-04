import { Component, Input, OnInit } from '@angular/core';
import { WeatherForecastResponse } from 'src/app/services/weatherapi.service';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.css'],
})
export class ForecastWeatherComponent implements OnInit {
  @Input() forecastWeatherData: WeatherForecastResponse | undefined;
  constructor() { }

  ngOnInit(): void {
  }
}
