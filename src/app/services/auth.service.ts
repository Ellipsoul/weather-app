import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User,
  Auth, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | null;

  constructor(private auth: Auth) {
    this.auth = getAuth();
    this.user = this.auth.currentUser;
  }

  signInWithGoogle(): Observable<UserCredential> {
    const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, googleAuthProvider));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
