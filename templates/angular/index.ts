import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from '../Root.component';
export * from '../Root.component';

import { <%= frontend.createComponent %> } from './<%= frontend.createComponent %>';
export * from './<%= frontend.createComponent %>';
import { <%= frontend.listComponent %> } from './<%= frontend.listComponent %>';
export * from './<%= frontend.listComponent %>';
import { <%= frontend.updateComponent %> } from './<%= frontend.updateComponent %>';
export * from './<%= frontend.updateComponent %>';
import { BB4UIModule } from "../../../bb4ui";

import { routes } from './routes';
export * from './routes';

export const declarations = [
  RootComponent,
  <%= frontend.createComponent %>,
  <%= frontend.listComponent %>,
  <%= frontend.updateComponent %>,
];

export const imports = [
  BB4UIModule,
  RouterModule.forRoot(routes, { useHash: true })
];

export const _exports = [
  BrowserModule,
  RouterModule,
  ...declarations
];


@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
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
