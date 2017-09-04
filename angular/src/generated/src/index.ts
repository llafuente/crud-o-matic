import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RootComponent } from './Root.component';
export * from './Root.component';

// All modules

import { UsersModule } from './Users.module';
export * from './Users.module';

import { RolesModule } from './Roles.module';
export * from './Roles.module';

import { VouchersModule } from './Vouchers.module';
export * from './Vouchers.module';

import { TestsModule } from './Tests.module';
export * from './Tests.module';


export const imports = [

  UsersModule,

  RolesModule,

  VouchersModule,

  TestsModule,

];

export const _exports = [
  BrowserModule,
  FormsModule,
  RouterModule,

  UsersModule,

  RolesModule,

  VouchersModule,

  TestsModule,

];


@NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      ...imports,
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: _exports
})
export class GenerateddAppModule {
  constructor(
  ) {
  }
}
