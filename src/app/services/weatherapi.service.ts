import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

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

  getAutoComplete(query: string): Observable<WeatherApiLocation[]> {
    return of([
      {
        'id': 2801268,
        'name': 'London',
        'region': 'City of London, Greater London',
        'country': 'United Kingdom',
        'lat': 51.52,
        'lon': -0.11,
        'url': 'london-city-of-london-greater-london-united-kingdom',
      },
      {
        'id': 2796590,
        'name': 'Holborn',
        'region': 'Camden, Greater London',
        'country': 'United Kingdom',
        'lat': 51.52,
        'lon': -0.12,
        'url': 'holborn-camden-greater-london-united-kingdom',
      },
    ]).pipe(delay(1000));
  }
}
