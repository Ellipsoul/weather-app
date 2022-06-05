import { Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WeatherForecastResponse, WeatherLiveResponse } from './weatherapi.service';

// Keeps track of the weather data state for when user navigates between pages
@Injectable({
  providedIn: 'root',
})
export class WeatherdataService {
  @Output() liveWeatherData = new Subject<WeatherLiveResponse>();
  @Output() forecastWeatherData = new Subject<WeatherForecastResponse>();

  constructor() { }

  // Gets the live weather data from the service
  getLiveWeatherData(): Observable<WeatherLiveResponse> {
    return this.liveWeatherData.asObservable();
  }

  // Sets the live weather data from the service
  setLiveWeatherData(weatherData: WeatherLiveResponse): void {
    this.liveWeatherData.next(weatherData);
  }

  // Gets the forecast weather data from the service
  getForecastWeatherData(): Observable<WeatherForecastResponse> {
    return this.forecastWeatherData.asObservable();
  }

  // Sets the forecast weather data from the service
  setForecastWeatherData(weatherData: WeatherForecastResponse): void {
    this.forecastWeatherData.next(weatherData);
  }
}
