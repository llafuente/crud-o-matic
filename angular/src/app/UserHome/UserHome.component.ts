// BaseComponent
import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";
import { ITest } from "../../generated/src/models/ITest";
import { LoggedUser } from "../LoggedUser.service";

@Component({
  selector: "user-home-component",
  templateUrl: "./UserHome.component.html",
})
export class UserHomeComponent extends BaseComponent {
  voucherKey = null;
  test: ITest = null;
  error: any = null;

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public router: Router,
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
    this.http
      .get(`${this.domain}/api/v1/tests/${testId}`)
      .subscribe((response: ITest) => {
        this.test = response;
      });
  }

  redeem(bbModal /*TODO type*/) {
    this.http
      .post(`${this.domain}/api/v1/users/redeem-voucher`, {
        voucherKey: this.voucherKey,
      })
      .subscribe(
        (response) => {
          console.log("redeem-voucher", response);
          this.handleSubscription(
            this.user.onChange.subscribe(() => {
              this.router.navigate(["/test", this.user.me.testId]);
            }),
          );
          this.user.refresh();
        },
        (errorResponse) => {
          console.log("redeem-voucher err", errorResponse);
          this.error = errorResponse;
          bbModal.show();
        },
      );
  }
}
