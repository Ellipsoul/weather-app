import { Injectable } from '@angular/core';
import Axios, { AxiosObservable } from 'axios-observable';

export interface WeatherApiLocation {
  id: number,
  name: string,
  region: string,
  country: string,
  lat: number,
  lon: number,
  url: string,
}

@Injectable({
  providedIn: 'root',
})
export class WeatherapiService {
  constructor() { }

  // Retrieves query autocomplete options from the API
  getAutoComplete(query: string): AxiosObservable<WeatherApiLocation[]> {
    console.log(query);
    return Axios.get(
        'https://api.weatherapi.com/v1/search.json',
        {
          headers: { key: 'bb3ea939b5fb4251bc0180930220905'},
          params: { q: query },
        },
    );
  }
}
