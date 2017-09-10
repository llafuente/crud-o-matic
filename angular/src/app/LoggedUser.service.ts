import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IUser } from "../generated/src/models/IUser";
import { Config } from "../generated/src";

@Injectable()
export class LoggedUser {
  me: IUser;
  onChange: Subject<LoggedUser> = new Subject<LoggedUser>();

  constructor(public http: HttpClient, public router: Router, public config: Config) {
    const token = localStorage.getItem("access_token");
    this.me = null;

    if (token) {
      this.refresh();
    }
  }

  setToken(token: string) {
    localStorage.setItem("access_token", token);
    this.refresh();
  }

  refresh() {
    this.http.post(`${this.config.get("domain")}/me`, null).subscribe((response: IUser) => {
      this.me = response;
      this.onChange.next(this);
      //this.onChange.complete();
    });
  }

  logout() {
    this.me = null;
    localStorage.setItem("access_token", null);
    this.router.navigate(["/login"]);
    this.onChange.next(this);
  }
}
