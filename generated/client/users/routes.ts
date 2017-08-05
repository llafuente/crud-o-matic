import { Routes } from '@angular/router';
import * as Components from './';

export const routes: Routes = [
/*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: 'user',
    component: Components.RootComponent,
    children: [{
      path: 'list',
      component: Components.ListUserComponent,
    }, {
      path: 'create',
      component: Components.CreateUserComponent,
    }, {
      path: 'update/:userId',
      component: Components.UpdateUserComponent,
    },]
  }
];


