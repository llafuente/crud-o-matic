import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { BB4UIModule } from "../bb4ui";
import { Config, GenerateddAppModule } from "../generated/src";
import { AppRoutingModule } from "./app.routing";

import { JwtModule } from "@auth0/angular-jwt";
import { AppComponent, components, services } from "./";

// TODO calculate hostname
//const domain = location.protocol + "//" + location.hostname + (location.port != "80" ? `:${parseInt(location.port, 10)+1}` : "");
const domain =
  location.hostname + (location.port != "80" ? `:${location.port}` : "");
const fullDomain = location.protocol + "//" + domain;
console.log("working domain", domain);

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
      whitelistedDomains: [domain /*, "elearning.tecnofor.us:3004"*/],
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
    config.set("domain", fullDomain);
    //config.set("domain", "http://elearning.tecnofor.us:3004");
  }
}
