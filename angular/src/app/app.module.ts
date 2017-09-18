import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";

import { BB4UIModule } from "../bb4ui";
import { AppRoutingModule } from "./app.routing";
import { GenerateddAppModule, Config } from "../generated/src";

import { JwtModule } from "@auth0/angular-jwt";
import { components, AppComponent, services } from "./";

// imports, declarations are exported to easy unit-testing configuration
export const imports = [
  BrowserModule,
  HttpModule,
  AppRoutingModule,
  FormsModule,
  BB4UIModule,
  GenerateddAppModule,
  HttpClientModule,
  JwtModule.forRoot({
    config: {
      tokenGetter: () => {
        console.log("tokenGetter:", localStorage.getItem("access_token"));
        return localStorage.getItem("access_token");
      },
      whitelistedDomains: ["34.229.180.92:3004", "localhost:3004"],
    },
  }),
];

export const declarations = [...components];

export const _exports = [GenerateddAppModule];

@NgModule({
  imports,
  declarations,
  providers: [...services],
  bootstrap: [AppComponent],
  exports: [_exports],
})
export class AppModule {
  constructor(config: Config) {
    config.set("domain", "http://localhost:3004");
    //config.set("domain", "http://34.229.180.92:3004");
  }
}
