import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { RootComponent } from "./Root.component";
export * from "./Root.component";

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule],
  declarations: [RootComponent],
  exports: [BrowserModule, FormsModule, RouterModule, RootComponent],
})
export class CommonModule {
  constructor() {}
}
