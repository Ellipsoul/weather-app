import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { QuerySnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { FirestoreService, WeatherQuery } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class PastqueriesService implements OnDestroy {
  pastQueries: BehaviorSubject<WeatherQuery[]>;
  user: User | null | undefined;
  userSubscription: Subscription | undefined;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private ngZone: NgZone) {
    this.pastQueries = new BehaviorSubject<WeatherQuery[]>([]);
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.ngZone.run(() => {
        this.user = user;
        if (this.pastQueries.getValue().length === 0) {
          this.getPastQueries(this.user);
        }
      });
    });
  }

  // Append a new query to the list and emit the new list
  appendQuery(query: WeatherQuery): void {
    const oldQueries: WeatherQuery[] = this.pastQueries.getValue();
    oldQueries.push(query);
    this.sortQueries();
  }

  getCurrentQueries(): WeatherQuery[] {
    return this.pastQueries.getValue();
  }

  getPastQueries(user: User | null): WeatherQuery[] {
    this.firestoreService.getPastQueries(user).subscribe({
      next: ((snapshot: QuerySnapshot) => {
        snapshot.docs.forEach((doc) => {
          this.appendQuery(doc.data() as WeatherQuery);
        });
      })});
    this.sortQueries();
    return this.pastQueries.getValue();
  }

  // Sort queries by date queried
  sortQueries(): void {
    const sortedQueries: WeatherQuery[] = this.pastQueries.getValue().sort((a, b) => {
      return b.dateQueried - a.dateQueried;
    });
    this.pastQueries.next(sortedQueries);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
