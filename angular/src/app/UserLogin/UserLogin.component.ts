import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { Component, Input } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Router } from "@angular/router";
import { LoggedUser } from "../LoggedUser.service";

interface IAuthResponse {
  token: string;
}

@Component({
  selector: "userlogin-component",
  templateUrl: "./UserLogin.component.html",
})
export class UserLoginComponent extends BaseComponent {
  auth: any = {
    userlogin: "",
    password: "",
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
    console.log(`POST: ${this.domain}/api/v1/auth`);
    this.http
      .post(`${this.domain}/api/v1/auth`, this.auth)
      .subscribe((response: Response) => {
        const token = (response.json() as IAuthResponse).token;
        console.log("set token", token);
        this.user.setToken(token);

        this.handleSubscription(
          this.user.onChange.subscribe(() => {
            this.router.navigate(["/home"]);
          }),
        );
      }, this.errorHandler.bind(this));
  }
}
