import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoggedUser } from "../LoggedUser.service";

@Component({
  selector: "user-home-component",
  templateUrl: "./UserHome.component.html",
})
export class UserHomeComponent {
  voucherKey = "xxx";

  constructor(public http: HttpClient, public user: LoggedUser) {}

  redeem() {
    this.http.post("http://localhost:3004/users/redeem-voucher", { voucherKey: this.voucherKey }).subscribe(
      response => {
        console.log("redeem-voucher", response);
      },
      errorResponse => {},
    );
  }
}
