import { Injectable, OnInit, OnDestroy, NgZone } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Firestore, DocumentReference, DocumentData, doc, setDoc, writeBatch,
  WriteBatch, increment, collection, CollectionReference, getDocs,
  QuerySnapshot } from '@angular/fire/firestore';
import { getFirestore } from '@firebase/firestore';
import { from, Observable, retry, Subscription } from 'rxjs';
import { WeatherType } from './weatherapi.service';

// Stores user metadata in the firestore database
interface UserMetadata {
  username: string,
  numberOfLiveQueries: number,
  numberOfForecastQueries: number,
  dateJoined: string,
}

export interface WeatherQuery {
  location: string,
  type: WeatherType,
  dateQueried: number
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements OnInit, OnDestroy {
  // Keep track of authenticated user
  user: User | null | undefined;
  userSubscription: Subscription | undefined;
  // Retrieve firestore database
  firestore!: Firestore;

  constructor(private authService: AuthService, private ngZone: NgZone) {
    this.firestore = getFirestore();
  }

  ngOnInit(): void {
    // Subscribe to the current user object
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.ngZone.run(() => {
        this.user = user;
      });
    });
  }

  // Runs when user first authenticates
  createNewUser(user: User): Observable<void> {
    const docRef:DocumentReference<DocumentData> = doc(this.firestore, 'users', user.uid);
    const data: UserMetadata = {
      username: user.displayName ? user.displayName : 'Anonymous',
      numberOfLiveQueries: 0,
      numberOfForecastQueries: 0,
      dateJoined: user.metadata.creationTime ?
        user.metadata.creationTime : 'Thu, 01 Jan 1970 00:00:00 UTC',
    };
    return from(setDoc(docRef, data)).pipe(retry(3));
  }

  // Log a user's successful live weather query
  logLiveWeatherQuery(user: User, weatherQuery: WeatherQuery): Observable<void> {
    // Perform a batch write for query and increment
    const batch: WriteBatch = writeBatch(this.firestore);
    const currentDate: number = Date.now();
    // User meta data increment
    const userDocRef: DocumentReference<DocumentData> = doc(this.firestore, 'users', user.uid);
    batch.update(userDocRef, { numberOfLiveQueries: increment(1) });
    // Query log write
    const queryLogRef: DocumentReference<DocumentData> =
      doc(this.firestore, 'users', user.uid, 'queries', currentDate.toString());
    batch.set(queryLogRef, weatherQuery);
    // Execute the batch write
    return from(batch.commit()).pipe(retry(3));
  }

  // Log a user's successful forecast weather query
  logForecastWeatherQuery(user: User, weatherQuery: WeatherQuery): Observable<void> {
    // Perform a batch write for query and increment
    const batch: WriteBatch = writeBatch(this.firestore);
    const currentDate: number = Date.now();
    // User meta data increment
    const userDocRef: DocumentReference<DocumentData> = doc(this.firestore, 'users', user.uid);
    batch.update(userDocRef, { numberOfForecastQueries: increment(1) });
    // Query log write
    const queryLogRef: DocumentReference<DocumentData> =
      doc(this.firestore, 'users', user.uid, 'queries', currentDate.toString());
    batch.set(queryLogRef, weatherQuery);
    // Execute the batch write
    return from(batch.commit()).pipe(retry(3));
  }

  // Get the previous queries from the user's firestore database
  getPastQueries(user: User | null): Observable<QuerySnapshot<DocumentData>> {
    if (!user) return from([]);
    const queriesCollection: CollectionReference<DocumentData> =
      collection(this.firestore, 'users', user.uid, 'queries');
    return from(getDocs(queriesCollection));
  }

  getUserDocRef(user: User | null): DocumentReference<DocumentData> | void {
    if (!user) return;
    return doc(this.firestore, 'users', user.uid);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
