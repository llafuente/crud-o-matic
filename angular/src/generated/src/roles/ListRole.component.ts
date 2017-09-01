import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { RoleType } from "../models/IRole";
import { Pagination } from "../common";

/**
 */
@Component({
  selector: "role-create-component",
  template: `
<bb-section>
  <bb-section-header>Listado de roles</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>

            <th>Etiqueta</th>

          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">

            <td>{{entity.label}}</td>

          <td class="actions">
            <a [routerLink]="['..', 'update', entity.id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
    <bb-button [routerLink]="['..', 'create']">Create</bb-button>
  </bb-section-content>
</bb-section>
<!-- <pre>entities: {{entities |json}}</pre> -->
  `,
})
export class ListRoleComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<RoleType>;

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: http://localhost:3004/roles");
    this.http.get("http://localhost:3004/roles").subscribe(
      (response: Pagination<RoleType>) => {
        console.log("<-- GET: http://localhost:3004/roles", response);

        this.entities = Pagination.fromJSON<RoleType>(RoleType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://localhost:3004/roles", errorResponse.json());
      },
    );
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: RoleType) {
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: http://localhost:3004/roles/:roleId", row);
    this.http
      .delete("http://localhost:3004/roles/:roleId".replace(":roleId", "" + row._id))
      .subscribe((response: Response) => {
        console.log("<-- DELETE: http://localhost:3004/roles/:roleId", response);
        this.entities.list.splice(idx, 1);
        this.loading = false;
      });
  }
}
