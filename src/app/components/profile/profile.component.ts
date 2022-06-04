import { Component, NgZone, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { onSnapshot } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

interface ProfileInfo {
  username: string,
  numberOfLiveQueries: number,
  numberOfForecastQueries: number,
  dateJoined: string,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null | undefined;
  userSubscription: Subscription | undefined;
  profileInfo: ProfileInfo | undefined = {
    username: 'Anonymous',
    numberOfLiveQueries: 0,
    numberOfForecastQueries: 0,
    dateJoined: 'Thu, 01 Jan 1970 00:00:00 UTC',
  };
  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private firestoreService: FirestoreService,
  ) {
    // Subscribe to user object and load in profile info once object is available
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.ngZone.run(() => {
        this.user = user;
        onSnapshot(this.firestoreService.getUserDocRef(user)!, (doc) => {
          this.profileInfo = doc.data() as ProfileInfo;
        });
      });
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
