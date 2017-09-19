import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
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
