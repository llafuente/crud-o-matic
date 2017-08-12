import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from './Root.component';
export * from './Root.component';

// All modules

import { UsersModule } from './Users.module';
export * from './Users.module';


export const imports = [

  UsersModule,

];

export const _exports = [
  BrowserModule,
  FormsModule,
  RouterModule,

  UsersModule,

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
