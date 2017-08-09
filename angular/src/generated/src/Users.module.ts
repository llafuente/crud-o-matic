import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from './Root.component';
export * from './Root.component';

// CRUD components
import { CreateUserComponent } from './users/CreateUser.component';
export * from './users/CreateUser.component';
import { ListUserComponent } from './users/ListUser.component';
export * from './users/ListUser.component';
import { UpdateUserComponent } from './users/UpdateUser.component';
export * from './users/UpdateUser.component';


import { BB4UIModule } from "../../bb4ui";

import { routes } from './users/routes';
export * from './users/routes';

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
