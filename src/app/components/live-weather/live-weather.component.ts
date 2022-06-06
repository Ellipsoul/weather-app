import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherLiveResponse } from 'src/app/services/weatherapi.service';
import { WeatherdataService } from 'src/app/services/weatherdata.service';
import { dayWeatherTypeMap, nightWeatherTypeMap,
  UnitSystem } from 'src/app/services/weatherdata.service';
import { DateTimeFormatPipe } from 'src/app/pipes/datetimeformat.pipe';

@Component({
  selector: 'app-live-weather',
  templateUrl: './live-weather.component.html',
  styleUrls: ['./live-weather.component.css'],
  providers: [DateTimeFormatPipe],
})
export class LiveWeatherComponent implements OnDestroy {
  // Live Weather data retrieved from service
  liveWeatherData: WeatherLiveResponse | undefined;
  liveWeatherDataSubscription: Subscription;
  // Useful variables extracted from liveWeatherData
  locationString: string | undefined;
  temperature: string | undefined;
  wind: string | undefined;
  windDirection : string | undefined;
  precipitation: string | undefined;
  weatherBackground: string | undefined;
  dateIso: string | undefined;
  // Keep track of metric or imperial units to display
  unitSystem: UnitSystem;

  constructor(private weatherdataService: WeatherdataService) {
    // Subscribe to the incoming live weather data
    this.liveWeatherDataSubscription = this.weatherdataService.liveWeatherData.subscribe(
        (weatherLiveResponse: WeatherLiveResponse) => {
          this.liveWeatherData = weatherLiveResponse;
          // Update useful variables once liveWeatherData is updated
          this.updateUsefulVariables();
        });
    // Retrieve the preferred unit system, defaulting to metric
    const unitSystem = localStorage.getItem('unitSystem');
    if (unitSystem === null) {
      localStorage.setItem('unitSystem', UnitSystem.Metric);
    }
    this.unitSystem = localStorage.getItem('unitSystem') as UnitSystem;
  }

  ngOnDestroy(): void {
    this.liveWeatherDataSubscription.unsubscribe();
  }

  // Switch between metric and imperial units
  toggleUnitSystem($event: string): void {
    this.unitSystem = $event as UnitSystem;
    localStorage.setItem('unitSystem', $event);
    this.updateUsefulVariables();
  }

  // Update the useful variable strings
  private updateUsefulVariables(): void {
    // Manually adding a leading 0 for poorly formatted date
    const time: string = this.liveWeatherData!.location.localtime;
    this.dateIso = time[time.length-5] !== ' ' ? this.liveWeatherData!.location.localtime :
      time.slice(0, time.length-4) + '0' + time.slice(time.length-4);
    this.locationString =
      `${this.liveWeatherData!.location.name}, ${this.liveWeatherData!.location.country}`;
    this.temperature = this.unitSystem === UnitSystem.Metric ?
      `${this.liveWeatherData!.current.temp_c} °C` : `${this.liveWeatherData!.current.temp_f} °F`;
    this.wind = this.unitSystem === UnitSystem.Metric ?
      `${this.liveWeatherData!.current.wind_kph} kph` :
      `${this.liveWeatherData!.current.wind_mph} mph`;
    // Show a wind direction symbol
    let windDirectionSymbol: string;
    const wd: number = this.liveWeatherData!.current.wind_degree;
    switch (true) {
      case ((337.5 <= wd && wd < 360) || (0 <= wd && wd < 22.5)):
        windDirectionSymbol = '↑';
        break;
      case (22.5 <= wd && wd < 67.5):
        windDirectionSymbol = '↗';
        break;
      case (67.5 <= wd && wd < 112.5):
        windDirectionSymbol = '→';
        break;
      case (112.5 <= wd && wd < 157.5):
        windDirectionSymbol = '↘';
        break;
      case (157.5 <= wd && wd < 202.5):
        windDirectionSymbol = '↓';
        break;
      case (202.5 <= wd && wd < 247.5):
        windDirectionSymbol = '↙';
        break;
      case (247.5 <= wd && wd < 292.5):
        windDirectionSymbol = '←';
        break;
      case (292.5 <= wd && wd < 337.5):
        windDirectionSymbol = '↖';
        break;
      default:
        windDirectionSymbol = '↑';
        break;
    }
    this.windDirection = `${windDirectionSymbol} ${this.liveWeatherData!.current.wind_degree}°`;
    this.precipitation = this.unitSystem === UnitSystem.Metric ?
      `${this.liveWeatherData!.current.precip_mm} mm` :
      `${this.liveWeatherData!.current.precip_in} in`;
    const weatherCode: string = this.liveWeatherData!.current.condition.code.toString();
    if (this.liveWeatherData!.current.is_day === 1) {
      this.weatherBackground = dayWeatherTypeMap[weatherCode];
    } else {
      this.weatherBackground = nightWeatherTypeMap[weatherCode];
    }
  }
}
