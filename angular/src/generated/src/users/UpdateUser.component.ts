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
  selector: "update-users-component",
  template: `

<bb-section>
  <bb-section-header>Editar usuario</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Userlogin"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-userlogin"
    name="userlogin"

    required="required"

    [(ngModel)]="entity.userlogin"
    #userlogin="ngModel"
    />

    <bb-errors [model]="userlogin"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Nombre"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-name"
    name="name"

    required="required"

    [(ngModel)]="entity.name"
    #name="ngModel"
    />

    <bb-errors [model]="name"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Apellidos"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-surname"
    name="surname"

    required="required"

    [(ngModel)]="entity.surname"
    #surname="ngModel"
    />

    <bb-errors [model]="surname"></bb-errors>

</bb-input-container>

<bb-input-container
  label="DNI/Nº Empleado"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-identifier"
    name="identifier"

    [(ngModel)]="entity.identifier"
    #identifier="ngModel"
    />

    <bb-errors [model]="identifier"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Email"

  class="bordered top-label">
  <input
    bb-child
    type="email" email
    id="id-email"
    name="email"

    required="required"

    [(ngModel)]="entity.email"
    #email="ngModel" />

    <bb-errors [model]="email"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Grupo/Empresa"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-group"
    name="group"

    [(ngModel)]="entity.group"
    #group="ngModel"
    />

    <bb-errors [model]="group"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Password"

  class="bordered top-label">
  <input
    bb-child
    type="password"
    id="id-password"
    name="password"

    required="required"

    [(ngModel)]="entity.password"
    #password="ngModel" />

    <bb-errors [model]="password"></bb-errors>

</bb-input-container>

<bb-check
  id="id-forceResetPassword"
  name="forceResetPassword"

  [(ngModel)]="entity.forceResetPassword">Forzar resetar contraseña</bb-check>

<bb-input-container
  label="Rol"

  class="bordered top-label">
  <select
    bb-child
    id="id-roleId"
    name="roleId"

    [(ngModel)]="entity.roleId"
    #roleId="ngModel">
    <option *ngFor="let row of roles?.list" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="roleId"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Voucher"

  class="bordered top-label">
  <select
    bb-child
    id="id-voucherId"
    name="voucherId"

    [(ngModel)]="entity.voucherId"
    #voucherId="ngModel">
    <option *ngFor="let row of vouchers?.list" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="voucherId"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Test"

  class="bordered top-label">
  <select
    bb-child
    id="id-testId"
    name="testId"

    [(ngModel)]="entity.testId"
    #testId="ngModel">
    <option *ngFor="let row of tests?.list" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="testId"></bb-errors>

</bb-input-container>

<bb-static label="Tests hechos" class="bordered top-label">
<pre>{{entity.testsDoneIds | json }}</pre>
</bb-static>

<bb-input-container
  label="State"

  class="bordered top-label">
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

<bb-static label="Stats" class="bordered top-label">
<pre>{{entity.stats | json }}</pre>
</bb-static>

      <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class UpdateUserComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: UserType = new UserType();

  roles: any;
  vouchers: any;
  tests: any;
  stateValues: { id: string; label: string }[] = [{ id: "active", label: "Active" }, { id: "banned", label: "Banned" }];

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading

    //this.id = parseInt(this.getRouteParameter("userId"), 10);
    this.id = this.getRouteParameter("userId");

    console.log("--> GET: /users/:userId", this.id);
    this.http.get("/users/:userId".replace(":userId", this.id)).subscribe(
      (response: UserType) => {
        console.log("<-- GET: /users/:userId", response);

        this.entity = response;
      },
      (errorResponse: Response) => {
        console.log("<-- POST Error: /users/:userId", errorResponse);
      },
    );

    this.http.get(`/roles`).subscribe(
      (response: any) => {
        console.log(`<-- GET: /roles`, JSON.stringify(response, null, 2));

        this.roles = response;

        // TODO this is not safe for nested properties, need a fix :)
        if (this.entity.roleId === undefined && response.list.length) {
          this.entity.roleId = response.list[0].id;
        }
      },
      (errorResponse: Response) => {
        console.log(`<-- GET Error: /roles`, errorResponse);
      },
    );

    this.http.get(`/vouchers`).subscribe(
      (response: any) => {
        console.log(`<-- GET: /vouchers`, JSON.stringify(response, null, 2));

        response.list.unshift({
          id: null,
          label: "",
        });

        this.vouchers = response;

        // TODO this is not safe for nested properties, need a fix :)
        if (this.entity.voucherId === undefined && response.list.length) {
          this.entity.voucherId = response.list[0].id;
        }
      },
      (errorResponse: Response) => {
        console.log(`<-- GET Error: /vouchers`, errorResponse);
      },
    );

    this.http.get(`/tests`).subscribe(
      (response: any) => {
        console.log(`<-- GET: /tests`, JSON.stringify(response, null, 2));

        response.list.unshift({
          id: null,
          label: "",
        });

        this.tests = response;

        // TODO this is not safe for nested properties, need a fix :)
        if (this.entity.testId === undefined && response.list.length) {
          this.entity.testId = response.list[0].id;
        }
      },
      (errorResponse: Response) => {
        console.log(`<-- GET Error: /tests`, errorResponse);
      },
    );
  }

  save() {
    console.log("<-- PATCH: /users/:userId", JSON.stringify(this.entity, null, 2));
    this.http.patch(`${this.domain}/users/:userId`.replace(":userId", this.id), this.entity).subscribe(
      (response: UserType) => {
        console.log("<-- PATCH: /users/:userId", JSON.stringify(response, null, 2));

        this.router.navigate(["../..", "list"], { relativeTo: this.activatedRoute });
      },
      (errorResponse: Response) => {
        console.log("<-- PATCH Error: /users/:userId", errorResponse);
      },
    );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }

  pushEntityTestsDoneIds(item: any) {
    this.entity.testsDoneIds = this.entity.testsDoneIds || [];
    this.entity.testsDoneIds.push(item);
  }

  pushEntityStats(item: any) {
    this.entity.stats = this.entity.stats || [];
    this.entity.stats.push(item);
  }

  pushEntityStatsAnswers(item: any, statsId) {
    this.entity.stats[statsId].answers = this.entity.stats[statsId].answers || [];
    this.entity.stats[statsId].answers.push(item);
  }
}
