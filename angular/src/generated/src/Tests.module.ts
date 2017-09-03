import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from './Common.module';


// CRUD components
import { CreateTestComponent } from './tests/CreateTest.component';
export * from './tests/CreateTest.component';
import { ListTestComponent } from './tests/ListTest.component';
export * from './tests/ListTest.component';
import { UpdateTestComponent } from './tests/UpdateTest.component';
export * from './tests/UpdateTest.component';


import { BB4UIModule } from "../../bb4ui";

import { routes } from './tests/routes';
/*export * from './tests/routes';*/

/*export*/ const declarations = [
  CreateTestComponent,
  ListTestComponent,
  UpdateTestComponent,
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
export class TestsModule {
  constructor(
  ) {
  }
}
