import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FileUploadModule } from "ng2-file-upload";
import { CommonModule } from "./Common.module";

// CRUD components
import { CreateVoucherComponent } from "./vouchers/CreateVoucher.component";
export * from "./vouchers/CreateVoucher.component";
import { ListVoucherComponent } from "./vouchers/ListVoucher.component";
export * from "./vouchers/ListVoucher.component";
import { UpdateVoucherComponent } from "./vouchers/UpdateVoucher.component";
export * from "./vouchers/UpdateVoucher.component";

import { ToastyModule } from "ng2-toasty";
import { BB4UIModule } from "../../bb4ui";

import { routes } from "./vouchers/routes";
/*export * from './vouchers/routes';*/

/*export*/ const declarations = [
  CreateVoucherComponent,
  ListVoucherComponent,
  UpdateVoucherComponent,
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
export class VouchersModule {
  constructor() {}
}
