import { Routes } from '@angular/router';
import { RootComponent } from '../Root.component';

import { ListUserComponent } from './ListUser.component';
import { CreateUserComponent } from './CreateUser.component';
import { UpdateUserComponent } from './UpdateUser.component';

export const routes: Routes = [
/*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: 'users',
    component: RootComponent,
    children: [{
      path: 'list',
      component: ListUserComponent,
    }, {
      path: 'create',
      component: CreateUserComponent,
    }, {
      path: 'update/:userId',
      component: UpdateUserComponent,
    },]
  }
];


