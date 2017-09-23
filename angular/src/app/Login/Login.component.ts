import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { Component, Input } from "@angular/core";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { LoggedUser } from "../LoggedUser.service";

@Component({
  selector: "login-component",
  templateUrl: "./Login.component.html",
})
export class LoginComponent extends BaseComponent {
  auth: any = {
    userlogin: "admin",
    password: "admin",
  };

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public router: Router,
    public http: Http,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);
  }

  login() {
    this.http
      .post(`${this.config.get("domain")}/api/v1/auth`, this.auth)
      .subscribe(
        (response) => {
          const token = response.json().token;
          console.log("set token", token);
          this.user.setToken(token);
          this.handleSubscription(
            this.user.onChange.subscribe(() => {
              this.router.navigate(["/home"]);
            }),
          );
        },
        (err) => {
          console.log("Error occured.", err);
        },
      );
  }
}
