import { Component, Input, OnInit, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { UserType } from "../models/IUser";

/**
 */
@Component({
  selector: "create-users-component",
  template: `

<div>
<form #f="ngForm" novalidate>
<bb-input-container label="Userlogin">
  <input
    bb-child
    type="text"
    id="id-userlogin"
    name="userlogin"
    [(ngModel)]="entity.userlogin"
    #userlogin="ngModel"
    />

    <bb-errors [model]="userlogin"></bb-errors>

</bb-input-container>

<bb-input-container label="Password">
  <input
    bb-child
    type="password"
    id="id-password"
    name="password"
    [(ngModel)]="entity.password"
    #password="ngModel" />

    <bb-errors [model]="password"></bb-errors>

</bb-input-container>

<bb-input-container label="Email">
  <input
    bb-child
    type="email" email
    id="id-email"
    name="email"
    [(ngModel)]="entity.email"
    #email="ngModel" />

    <bb-errors [model]="email"></bb-errors>

</bb-input-container>

<bb-input-container label="Roles">
  <select
    bb-child
    id="id-roles"
    name="roles"
    [(ngModel)]="entity.roles"
    #roles="ngModel">
    <option *ngFor="let row of roles.list" [ngValue]="id">{{row.label}}</option>
    </select>

    <bb-errors [model]="roles"></bb-errors>

</bb-input-container>

<bb-input-container label="State">
  <select
    bb-child
    id="id-state"
    name="state"
    [(ngModel)]="entity.state"
    #state="ngModel">
    <option *ngFor="let row of stateValues" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="state"></bb-errors>

</bb-input-container>

  <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
  <bb-button (click)="save()">Guardar</bb-button>
</form>
<pre>entity: {{entity | json}}</pre>
</div>

`,
})
export class CreateUserComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: UserType = new UserType();

  roles: any;
  stateValues: { id: string; label: string }[] = [{ id: "active", label: "Active" }, { id: "banned", label: "Banned" }];

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading

    this.http.get("http://localhost:3004/roles").subscribe(
      (response: any) => {
        console.log("<-- GET: http://localhost:3004/roles", JSON.stringify(response, null, 2));

        this.roles = response;
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://localhost:3004/roles", errorResponse);
      },
    );
  }

  save() {
    console.log("--> POST: http://localhost:3004/users", JSON.stringify(this.entity, null, 2));
    this.http.post("http://localhost:3004/users", this.entity).subscribe(
      (response: UserType) => {
        console.log("<-- POST: http://localhost:3004/users", JSON.stringify(response, null, 2));

        this.router.navigate(["..", "list"], { relativeTo: this.activatedRoute });
      },
      (errorResponse: Response) => {
        console.log("<-- POST Error: http://localhost:3004/users", errorResponse);
      },
    );
  }

  // for lists
  push(model: any[]) {
    model.push({});
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
