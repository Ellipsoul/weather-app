import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Firestore, DocumentReference, DocumentData, doc, setDoc } from '@angular/fire/firestore';
import { getFirestore } from '@firebase/firestore';
import { from, Observable, retry, Subscription } from 'rxjs';

// Stores user metadata in the firestore database
interface UserMetadata {
  username: string,
  numberOfQueries: number,
  dateJoined: string,
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

  constructor(private authService: AuthService) {
    this.firestore = getFirestore();
  }

  ngOnInit(): void {
    // Subscribe to the current user object
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  // Runs when user first authenticates
  createNewUser(user: User): Observable<void> {
    const docRef:DocumentReference<DocumentData> = doc(this.firestore, 'users', user.uid);
    const data: UserMetadata = {
      username: user.displayName ? user.displayName : 'Anonymous',
      numberOfQueries: 0,
      dateJoined: user.metadata.creationTime ?
        user.metadata.creationTime : 'Thu, 01 Jan 1970 00:00:00 UTC',
    };
    return from(setDoc(docRef, data)).pipe(retry(3));
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
