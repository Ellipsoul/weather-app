import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from '../components/profile/profile.component';
import { HomepageComponent } from '../components/homepage/homepage.component';

const routes: Routes = [
  { path: 'app', component: HomepageComponent, data: { title: 'SkyStory - App' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'SkyStory - Profile' } },
  { path: '**', redirectTo: '/app'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
