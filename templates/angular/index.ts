import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from './Root.component';
export * from './Root.component';

// All modules
<% _.each(generator.schemas, (schema) => { %>
import { <%= schema.module %> } from './<%= schema.moduleFile %>';
export * from './<%= schema.moduleFile %>';
<% }) %>

export const imports = [
<% _.each(generator.schemas, (schema) => { %>
  <%= schema.module %>,
<% }) %>
];

export const _exports = [
  BrowserModule,
  FormsModule,
  RouterModule,
<% _.each(generator.schemas, (schema) => { %>
  <%= schema.module %>,
<% }) %>
];


@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      ...imports,
    ],
    declarations: [],
    providers: [
    ],
    exports: _exports
})
export class GenerateddAppModule {
  constructor(
  ) {
  }
}
