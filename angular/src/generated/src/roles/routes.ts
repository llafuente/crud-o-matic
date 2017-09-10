import { Routes } from "@angular/router";
import { RootComponent } from "../Root.component";

import { ListRoleComponent } from "./ListRole.component";
import { CreateRoleComponent } from "./CreateRole.component";
import { UpdateRoleComponent } from "./UpdateRole.component";

export const routes: Routes = [
  /*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: "roles",
    component: RootComponent,
    children: [
      {
        path: "list",
        component: ListRoleComponent,
      },
      {
        path: "create",
        component: CreateRoleComponent,
      },
      {
        path: "update/:roleId",
        component: UpdateRoleComponent,
      },
    ],
  },
];
