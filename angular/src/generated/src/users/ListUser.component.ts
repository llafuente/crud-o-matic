import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { UserType } from "../models/IUser";
import { Pagination } from "../common";

/**
 */
@Component({
  selector: "user-create-component",
  template: `
<bb-section>
  <bb-section-header>Listado de usuarios</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>

            <th>Userlogin</th>

            <th>Password</th>

            <th>Email</th>

            <th>Rol</th>

            <th>Voucher</th>

            <th>State</th>

            <th>Stats</th>

          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">

            <td>{{entity.userlogin}}</td>

            <td>{{entity.password}}</td>

            <td>{{entity.email}}</td>

            <td>{{entity.roleId}}</td>

            <td>{{entity.voucherId}}</td>

            <td>{{entity.state}}</td>

            <td>{{entity.stats}}</td>

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
export class ListUserComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<UserType>;

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: http://localhost:3004/users");
    this.http.get("http://localhost:3004/users").subscribe(
      (response: Pagination<UserType>) => {
        console.log("<-- GET: http://localhost:3004/users", response);

        this.entities = Pagination.fromJSON<UserType>(UserType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://localhost:3004/users", errorResponse.json());
      },
    );
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: UserType) {
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: http://localhost:3004/users/:userId", row);
    this.http
      .delete("http://localhost:3004/users/:userId".replace(":userId", "" + row._id))
      .subscribe((response: Response) => {
        console.log("<-- DELETE: http://localhost:3004/users/:userId", response);
        this.entities.list.splice(idx, 1);
        this.loading = false;
      });
  }
}
