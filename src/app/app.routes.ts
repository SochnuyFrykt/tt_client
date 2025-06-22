import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EmployeesComponent } from './components/employees/employees.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: '**', redirectTo: 'home' }
];
