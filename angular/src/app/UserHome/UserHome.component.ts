import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoggedUser } from "../LoggedUser.service";
import { ITest } from "../../generated/src/models/ITest";
import { BaseComponent } from "../../generated/src/Base.component";

@Component({
  selector: "user-home-component",
  templateUrl: "./UserHome.component.html",
})
export class UserHomeComponent extends BaseComponent {
  voucherKey = null;
  test: ITest = null;
  error: any = null;

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);
    this.handleSubscription(
      this.user.onChange.subscribe(() => {
        if (this.user.me.testId) {
          this.loadTest(this.user.me.testId);
        }
      }),
    );

    if (this.user.me.testId) {
      this.loadTest(this.user.me.testId);
    }
  }

  loadTest(testId: string) {
    // load test
    this.http.get("http://localhost:3004/tests/" + testId).subscribe((response: ITest) => {
      this.test = response;
    });
  }

  redeem(bbModal /*TODO type*/) {
    this.http.post("http://localhost:3004/users/redeem-voucher", { voucherKey: this.voucherKey }).subscribe(
      response => {
        console.log("redeem-voucher", response);
        this.user.refresh();
      },
      errorResponse => {
        console.log("redeem-voucher err", errorResponse);
        this.error = errorResponse;
        bbModal.show();
      },
    );
  }
}
