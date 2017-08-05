import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from '../Root.component';
export * from '../Root.component';

import { CreateUserComponent } from './CreateUserComponent';
export * from './CreateUserComponent';
import { ListUserComponent } from './ListUserComponent';
export * from './ListUserComponent';
import { UpdateUserComponent } from './UpdateUserComponent';
export * from './UpdateUserComponent';
import { BB4UIModule } from "../../../bb4ui";

import { routes } from './routes';
export * from './routes';

export const declarations = [
  RootComponent,
  CreateUserComponent,
  ListUserComponent,
  UpdateUserComponent,
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
export class UsersModule {
  constructor(
  ) {
  }
}
