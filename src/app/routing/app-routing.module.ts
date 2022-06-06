import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';

import { ProfileComponent } from '../components/profile/profile.component';
import { HomepageComponent } from '../components/homepage/homepage.component';

// Redirect all non-matching routes to the app page
const routes: Routes = [
  { path: 'app', component: HomepageComponent, data: { title: 'SkyStory - App' } },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'SkyStory - Profile' },
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/app'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
