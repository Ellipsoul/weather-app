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

export enum UnitSystem {
  // eslint-disable-next-line no-unused-vars
  Metric = 'metric',
  // eslint-disable-next-line no-unused-vars
  Imperial = 'imperial',
}

// Converting the poorly fomratted date into ISO format
export function parseToIsoFormat(date: string) {
  return (date[date.length-5] !== ' ' ? date :
    date.slice(0, date.length-4) + '0' + date.slice(date.length-4));
}

// Mapping the weather code to the correct weather type
export const dayWeatherTypeMap: Record<string, string> = {
  '1000': 'bg-sunnyDay',
  '1003': 'bg-cloudyDay',
  '1006': 'bg-cloudyDay',
  '1009': 'bg-cloudyDay',
  '1030': 'bg-mistyDay',
  '1135': 'bg-mistyDay',
  '1147': 'bg-mistyDay',
  '1063': 'bg-rainyDay',
  '1072': 'bg-rainyDay',
  '1150': 'bg-rainyDay',
  '1153': 'bg-rainyDay',
  '1168': 'bg-rainyDay',
  '1171': 'bg-rainyDay',
  '1180': 'bg-rainyDay',
  '1183': 'bg-rainyDay',
  '1186': 'bg-rainyDay',
  '1189': 'bg-rainyDay',
  '1192': 'bg-rainyDay',
  '1195': 'bg-rainyDay',
  '1198': 'bg-rainyDay',
  '1201': 'bg-rainyDay',
  '1240': 'bg-rainyDay',
  '1243': 'bg-rainyDay',
  '1246': 'bg-rainyDay',
  '1066': 'bg-snowyDay',
  '1069': 'bg-snowyDay',
  '1114': 'bg-snowyDay',
  '1117': 'bg-snowyDay',
  '1204': 'bg-snowyDay',
  '1207': 'bg-snowyDay',
  '1210': 'bg-snowyDay',
  '1213': 'bg-snowyDay',
  '1216': 'bg-snowyDay',
  '1219': 'bg-snowyDay',
  '1122': 'bg-snowyDay',
  '1125': 'bg-snowyDay',
  '1237': 'bg-snowyDay',
  '1249': 'bg-snowyDay',
  '1252': 'bg-snowyDay',
  '1255': 'bg-snowyDay',
  '1258': 'bg-snowyDay',
  '1261': 'bg-snowyDay',
  '1264': 'bg-snowyDay',
  '1279': 'bg-snowyDay',
  '1282': 'bg-snowyDay',
  '1087': 'bg-stormyDay',
  '1273': 'bg-stormyDay',
  '1276': 'bg-stormyDay',
};

export const nightWeatherTypeMap: Record<string, string> = {
  '1000': 'bg-sunnyNight',
  '1003': 'bg-cloudyNight',
  '1006': 'bg-cloudyNight',
  '1009': 'bg-cloudyNight',
  '1030': 'bg-mistyNight',
  '1135': 'bg-mistyNight',
  '1147': 'bg-mistyNight',
  '1063': 'bg-rainyNight',
  '1072': 'bg-rainyNight',
  '1150': 'bg-rainyNight',
  '1153': 'bg-rainyNight',
  '1168': 'bg-rainyNight',
  '1171': 'bg-rainyNight',
  '1180': 'bg-rainyNight',
  '1183': 'bg-rainyNight',
  '1186': 'bg-rainyNight',
  '1189': 'bg-rainyNight',
  '1192': 'bg-rainyNight',
  '1195': 'bg-rainyNight',
  '1198': 'bg-rainyNight',
  '1201': 'bg-rainyNight',
  '1240': 'bg-rainyNight',
  '1243': 'bg-rainyNight',
  '1246': 'bg-rainyNight',
  '1066': 'bg-snowyNight',
  '1069': 'bg-snowyNight',
  '1114': 'bg-snowyNight',
  '1117': 'bg-snowyNight',
  '1204': 'bg-snowyNight',
  '1207': 'bg-snowyNight',
  '1210': 'bg-snowyNight',
  '1213': 'bg-snowyNight',
  '1216': 'bg-snowyNight',
  '1219': 'bg-snowyNight',
  '1122': 'bg-snowyNight',
  '1125': 'bg-snowyNight',
  '1237': 'bg-snowyNight',
  '1249': 'bg-snowyNight',
  '1252': 'bg-snowyNight',
  '1255': 'bg-snowyNight',
  '1258': 'bg-snowyNight',
  '1261': 'bg-snowyNight',
  '1264': 'bg-snowyNight',
  '1279': 'bg-snowyNight',
  '1282': 'bg-snowyNight',
  '1087': 'bg-stormyNight',
  '1273': 'bg-stormyNight',
  '1276': 'bg-stormyNight',
};
