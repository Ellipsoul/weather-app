import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { HomepageComponent } from '../components/homepage/homepage.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent, data: { title: 'WeatherApp - Home' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'WeatherApp - Dashboard' } },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
