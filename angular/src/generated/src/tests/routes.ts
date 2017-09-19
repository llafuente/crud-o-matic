import { Routes } from "@angular/router";
import { RootComponent } from "../Root.component";

import { CreateTestComponent } from "./CreateTest.component";
import { ListTestComponent } from "./ListTest.component";
import { UpdateTestComponent } from "./UpdateTest.component";

export const routes: Routes = [
  /*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: "tests",
    component: RootComponent,
    children: [
      {
        path: "list",
        component: ListTestComponent,
      },
      {
        path: "create",
        component: CreateTestComponent,
      },
      {
        path: "update/:testId",
        component: UpdateTestComponent,
      },
    ],
  },
];
