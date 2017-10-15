import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
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

<bb-input-container
  label="Tags"
   help="Categorización para estadísticas"
  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-tags"
    name="tags"

    [(ngModel)]="entity.tags"
    #tags="ngModel"
    />

    <bb-errors [model]="tags"></bb-errors>

</bb-input-container>

<bb-static label="Stats" class="bordered top-label">
<pre>{{entity.stats | json }}</pre>
</bb-static>

      <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
      <bb-button [disabled]="!f.valid" (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class UpdateUserComponent extends BaseComponent implements OnInit {
  loading: false;
  id: string;
  entity: UserType = new UserType();

  roles: any;
  stateValues: Array<{ id: string; label: string }> = [
    { id: "active", label: "Active" },
    { id: "banned", label: "Banned" },
  ];

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public router: Router,
  ) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading

    //this.id = parseInt(this.getRouteParameter("userId"), 10);
    this.id = this.getRouteParameter("userId");

    console.log(`--> GET: ${this.domain}/api/v1/users/:userId`, this.id);
    this.http
      .get(`${this.domain}/api/v1/users/:userId`.replace(":userId", this.id))
      .subscribe(
        (response: UserType) => {
          console.log(
            `<-- GET: ${this.domain}/api/v1/users/:userId`,
            JSON.stringify(response, null, 2),
          );

          this.entity = response;
        },
        (errorResponse: Response) => {
          console.log(
            `<-- GET Error: ${this.domain}/api/v1/users/:userId`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );

    this.http.get(`${this.domain}/api/v1/roles`).subscribe(
      (response: any) => {
        console.log(
          `<-- GET: ${this.domain}/api/v1/roles`,
          JSON.stringify(response, null, 2),
        );

        this.roles = response;

        // TODO this is not safe for nested properties, need a fix :)
        if (this.entity.roleId === undefined) {
          if (response.list.length) {
            this.entity.roleId = response.list[0].id;
          }
        } else {
          // TODO check some are valid, if not nullify
        }
      },
      (errorResponse: Response) => {
        console.log(
          `<-- GET Error: ${this.domain}/api/v1/roles`,
          errorResponse,
        );
      },
    );
  }

  save() {
    console.log(
      `<-- PATCH: ${this.domain}/api/v1/users/:userId`,
      JSON.stringify(this.entity, null, 2),
    );
    this.http
      .patch(
        `${this.domain}/api/v1/users/:userId`.replace(":userId", this.id),
        this.entity,
      )
      .subscribe(
        (response: UserType) => {
          console.log(
            `<-- PATCH: ${this.domain}/api/v1/users/:userId`,
            JSON.stringify(response, null, 2),
          );

          this.router.navigate(["../..", "list"], {
            relativeTo: this.activatedRoute,
          });
        },
        (errorResponse: Response) => {
          console.log(
            "<-- PATCH Error: ${this.domain}/api/v1/users/:userId",
            errorResponse,
          );
          this.errorHandler(errorResponse);
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
    this.entity.stats[statsId].answers =
      this.entity.stats[statsId].answers || [];
    this.entity.stats[statsId].answers.push(item);
  }
}
