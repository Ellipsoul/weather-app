import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService, WeatherQuery } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class PastqueriesService {
  pastQueries: BehaviorSubject<WeatherQuery[]>;

  constructor(private firestoreService: FirestoreService) {
    this.pastQueries = new BehaviorSubject<WeatherQuery[]>([]);
  }

  // Append a new query to the list and emit the new list
  appendQuery(query: WeatherQuery): void {
    const oldQueries: WeatherQuery[] = this.pastQueries.getValue();
    oldQueries.push(query);
    this.pastQueries.next(oldQueries);
  }

  getQueries(): WeatherQuery[] {
    return this.pastQueries.getValue();
  }
}
