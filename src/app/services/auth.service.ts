import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User,
  Auth, UserCredential, onAuthStateChanged } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.auth = getAuth();
    // Subscribe to the current user object
    this.user$ = new Observable((observer) => onAuthStateChanged(auth, observer));
  }

  // Google authentication as observable
  signInWithGoogle(): Observable<UserCredential> {
    const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, googleAuthProvider));
  }

  // Sign out as observable
  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }
}
