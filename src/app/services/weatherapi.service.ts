import { Injectable } from '@angular/core';
import Axios, { AxiosObservable } from 'axios-observable';

@Injectable({
  providedIn: 'root',
})
export class WeatherapiService {
  constructor() { }

  // Retrieves query autocomplete options from the API
  getAutoComplete(query: string): AxiosObservable<WeatherAutocompleteLocation[]> {
    return Axios.get(
        'https://api.weatherapi.com/v1/search.json',
        {
          headers: { key: 'bb3ea939b5fb4251bc0180930220905'},
          params: { q: query },
        },
    );
  }

  // Get the live or forecast weather from the API
  getLiveWeather(location: string): AxiosObservable<WeatherLiveResponse> {
    return Axios.get(
        'https://api.weatherapi.com/v1/current.json',
        {
          headers: { key: 'bb3ea939b5fb4251bc0180930220905'},
          params: { q: location, aqi: 'no' },
        },
    );
  }

  // Get the forecast weather from the API
  getForecastWeather(location: string): AxiosObservable<WeatherForecastResponse> {
    return Axios.get(
        'https://api.weatherapi.com/v1/forecast.json',
        {
          headers: { key: 'bb3ea939b5fb4251bc0180930220905'},
          params: { q: location, days: '7', aqi: 'no', alerts: 'no' },
        },
    );
  }
}

// Interface for autocomplete locations
export interface WeatherAutocompleteLocation {
  id: number,
  name: string,
  region: string,
  country: string,
  lat: number,
  lon: number,
  url: string,
}

// Interfaces for live weather API response
export interface WeatherLiveResponse {
  location: WeatherLocation,
  current: WeatherCurrentInfo,
}

export interface WeatherLocation {
  name: string,
  region: string,
  country: string,
  lat: number,
  lon: number,
  tz_id: string,
  localtime_epoch: number,
  localtime: string,
}

export interface WeatherCurrentInfo {
  temp_c: number,
  temp_f: number,
  is_day: boolean,
  condition: WeatherCondition
  wind_mph: number,
  wind_kph: number,
  wind_degree: number,
  precip_mm: number,
  precip_in: number,
  humidity: number,
  uv: number,
}

export interface WeatherCondition {
  text: string,
  icon: string,
  code: number,
}

export interface WeatherForecastResponse {
  location: WeatherLocation,
  forecast: ForecastDayWrapper
}

export interface ForecastDayWrapper {
  forecastday: ForecastDayObject[];
}

export interface ForecastDayObject {
  date: string,
  date_epoch: number,
  day: ForecastDay,
}

export interface ForecastDay {
  maxtemp_c: number,
  maxtemp_f: number,
  mintemp_c: number,
  mintemp_f: number,
  avgtemp_c: number,
  avgtemp_f: number,
  condition: WeatherCondition,
}

export enum WeatherType {
  // eslint-disable-next-line no-unused-vars
  Live = 'Live',
  // eslint-disable-next-line no-unused-vars
  Forecast = 'Forecast',
}
