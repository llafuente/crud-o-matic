import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "./Common.module";

// CRUD components
import { CreateUserComponent } from "./users/CreateUser.component";
export * from "./users/CreateUser.component";
import { ListUserComponent } from "./users/ListUser.component";
export * from "./users/ListUser.component";
import { UpdateUserComponent } from "./users/UpdateUser.component";
export * from "./users/UpdateUser.component";

import { ToastyModule } from "ng2-toasty";
import { BB4UIModule } from "../../bb4ui";

import { routes } from "./users/routes";
/*export * from './users/routes';*/

/*export*/ const declarations = [
  CreateUserComponent,
  ListUserComponent,
  UpdateUserComponent,
];

/*export*/ const imports = [
  BB4UIModule,
  ToastyModule,
  RouterModule.forRoot(routes, { useHash: true }),
];

/*export*/ const _exports = [ToastyModule, BB4UIModule, ...declarations];

@NgModule({
  imports: [CommonModule, FileUploadModule, ...imports],
  declarations,
  providers: [],
  exports: _exports,
})
export class UsersModule {
  constructor() {}
}
