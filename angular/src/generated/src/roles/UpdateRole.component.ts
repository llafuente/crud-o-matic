import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { RoleType } from "../models/IRole";

/**
 */
@Component({
  selector: "update-roles-component",
  template: `

<bb-section>
  <bb-section-header>Editar Rol</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Etiqueta"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-label"
    name="label"

    [(ngModel)]="entity.label"
    #label="ngModel"
    />

    <bb-errors [model]="label"></bb-errors>

</bb-input-container>

      <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class UpdateRoleComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: RoleType = new RoleType();

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

    //this.id = parseInt(this.getRouteParameter("roleId"), 10);
    this.id = this.getRouteParameter("roleId");

    console.log(`--> GET: ${this.domain}/roles/:roleId`, this.id);
    this.http
      .get(`${this.domain}/roles/:roleId`.replace(":roleId", this.id))
      .subscribe(
        (response: RoleType) => {
          console.log(
            `<-- GET: ${this.domain}/roles/:roleId`,
            JSON.stringify(response, null, 2),
          );

          this.entity = response;
        },
        (errorResponse: Response) => {
          console.log(
            `<-- GET Error: ${this.domain}/roles/:roleId`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }

  save() {
    console.log(
      `<-- PATCH: ${this.domain}/roles/:roleId`,
      JSON.stringify(this.entity, null, 2),
    );
    this.http
      .patch(
        `${this.domain}/roles/:roleId`.replace(":roleId", this.id),
        this.entity,
      )
      .subscribe(
        (response: RoleType) => {
          console.log(
            `<-- PATCH: ${this.domain}/roles/:roleId`,
            JSON.stringify(response, null, 2),
          );

          this.router.navigate(["../..", "list"], {
            relativeTo: this.activatedRoute,
          });
        },
        (errorResponse: Response) => {
          console.log(
            "<-- PATCH Error: ${this.domain}/roles/:roleId",
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
