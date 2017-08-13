import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from './Common.module';


// CRUD components
import { <%= frontend.createComponent %> } from './<%= plural %>/<%= frontend.createComponentFile %>';
export * from './<%= plural %>/<%= frontend.createComponentFile %>';
import { <%= frontend.listComponent %> } from './<%= plural %>/<%= frontend.listComponentFile %>';
export * from './<%= plural %>/<%= frontend.listComponentFile %>';
import { <%= frontend.updateComponent %> } from './<%= plural %>/<%= frontend.updateComponentFile %>';
export * from './<%= plural %>/<%= frontend.updateComponentFile %>';


import { BB4UIModule } from "../../bb4ui";

import { routes } from './<%= plural %>/routes';
/*export * from './<%= plural %>/routes';*/

/*export*/ const declarations = [
  <%= frontend.createComponent %>,
  <%= frontend.listComponent %>,
  <%= frontend.updateComponent %>,
];

/*export*/ const imports = [
  BB4UIModule,
  RouterModule.forRoot(routes, { useHash: true })
];

/*export*/ const _exports = [
  ...declarations
];


@NgModule({
    imports: [
      CommonModule,
      ...imports,
    ],
    declarations: declarations,
    providers: [
    ],
    exports: _exports
})
export class <%= module %> {
  constructor(
  ) {
  }
}
