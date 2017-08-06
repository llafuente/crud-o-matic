import { Routes } from '@angular/router';
import { RootComponent } from '../Root.component';

import { <%= frontend.listComponent %> } from './<%= frontend.listComponentFile %>';
import { <%= frontend.createComponent %> } from './<%= frontend.createComponentFile %>';
import { <%= frontend.updateComponent %> } from './<%= frontend.updateComponentFile %>';

export const routes: Routes = [
/*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: '<%= plural %>',
    component: RootComponent,
    children: [{
      path: 'list',
      component: <%= frontend.listComponent %>,
    }, {
      path: 'create',
      component: <%= frontend.createComponent %>,
    }, {
      path: 'update/:<%= entityId %>',
      component: <%= frontend.updateComponent %>,
    },]
  }
];


