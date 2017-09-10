import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "./Common.module";

// CRUD components
import { CreateRoleComponent } from "./roles/CreateRole.component";
export * from "./roles/CreateRole.component";
import { ListRoleComponent } from "./roles/ListRole.component";
export * from "./roles/ListRole.component";
import { UpdateRoleComponent } from "./roles/UpdateRole.component";
export * from "./roles/UpdateRole.component";

import { BB4UIModule } from "../../bb4ui";

import { routes } from "./roles/routes";
/*export * from './roles/routes';*/

/*export*/ const declarations = [CreateRoleComponent, ListRoleComponent, UpdateRoleComponent];

/*export*/ const imports = [BB4UIModule, RouterModule.forRoot(routes, { useHash: true })];

/*export*/ const _exports = [...declarations];

@NgModule({
  imports: [CommonModule, FileUploadModule, ...imports],
  declarations: declarations,
  providers: [],
  exports: _exports
})
export class RolesModule {
  constructor() {}
}
