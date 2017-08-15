import { Component, Input } from "@angular/core";
import { Http } from "@angular/http";

@Component({
  selector: "login-component",
  templateUrl: "./Login.component.html",
})
export class LoginComponent {
  auth: any = {
    userlogin: "admin",
    password: "admin",
  };

  constructor(public http: Http) {}

  login() {
    this.http.post("http://localhost:3004/auth", this.auth).subscribe(
      response => {
        const token = response.json().token;
        console.log("set token", token);

        localStorage.setItem("access_token", token);
      },
      errorResponse => {},
    );
  }
}
