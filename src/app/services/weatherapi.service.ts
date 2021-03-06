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
          params: {
            key: 'bb3ea939b5fb4251bc0180930220905',
            q: query,
          },
        },
    );
  }

  // Get the live or forecast weather from the API
  getLiveWeather(location: string): AxiosObservable<WeatherLiveResponse> {
    return Axios.get(
        'https://api.weatherapi.com/v1/current.json',
        {
          params: {
            key: 'bb3ea939b5fb4251bc0180930220905',
            q: location,
            aqi: 'no',
          },
        },
    );
  }

  // Get the forecast weather from the API
  getForecastWeather(location: string): AxiosObservable<WeatherForecastResponse> {
    return Axios.get(
        'https://api.weatherapi.com/v1/forecast.json',
        {
          params: {
            key: 'bb3ea939b5fb4251bc0180930220905',
            q: location,
            days: '3',
            aqi: 'no',
            alerts: 'no',
          },
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
  is_day: number,
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
  current: {
    is_day: number;
  }
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

// More robust interface for useful forecast weather API info
export interface ForecastInfo {
  dateIso: string,
  code: number,
  condition: string,
  minTemp: string,
  avgTemp: string,
  maxTemp: string,
  background: string,
}
