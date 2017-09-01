import { Component, Input } from "@angular/core";
import { Http } from "@angular/http";
import { LoggedUser } from "../LoggedUser.service";

@Component({
  selector: "test-component",
  templateUrl: "./Test.component.html",
})
export class TestComponent {
  auth: any = {
    userlogin: "admin",
    password: "admin",
  };

  constructor(public http: Http, public user: LoggedUser) {}

  login() {
    this.http.post("http://localhost:3004/auth", this.auth).subscribe(
      response => {
        const token = response.json().token;
        console.log("set token", token);
        this.user.setToken(token);
      },
      errorResponse => {},
    );
  }
}
