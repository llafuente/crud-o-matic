import { Routes } from "@angular/router";
import { RootComponent } from "../Root.component";

import { ListVoucherComponent } from "./ListVoucher.component";
import { CreateVoucherComponent } from "./CreateVoucher.component";
import { UpdateVoucherComponent } from "./UpdateVoucher.component";

export const routes: Routes = [
  /*
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
*/
  {
    path: "vouchers",
    component: RootComponent,
    children: [
      {
        path: "list",
        component: ListVoucherComponent,
      },
      {
        path: "create",
        component: CreateVoucherComponent,
      },
      {
        path: "update/:voucherId",
        component: UpdateVoucherComponent,
      },
    ],
  },
];
