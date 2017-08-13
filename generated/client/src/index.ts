import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RootComponent } from './Root.component';
export * from './Root.component';

// All modules

import { UsersModule } from './Users.module';
export * from './Users.module';

import { VouchersModule } from './Vouchers.module';
export * from './Vouchers.module';


export const imports = [

  UsersModule,

  VouchersModule,

];

export const _exports = [
  BrowserModule,
  FormsModule,
  RouterModule,

  UsersModule,

  VouchersModule,

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
