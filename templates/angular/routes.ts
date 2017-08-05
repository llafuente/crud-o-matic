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
    path: '<%= singular %>',
    component: Components.RootComponent,
    children: [{
      path: 'list',
      component: Components.<%= frontend.listComponent %>,
    }, {
      path: 'create',
      component: Components.<%= frontend.createComponent %>,
    }, {
      path: 'update/:<%= entityId %>',
      component: Components.<%= frontend.updateComponent %>,
    },]
  }
];


