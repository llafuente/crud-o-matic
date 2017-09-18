import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { UserType } from "../models/IUser";
import { Pagination } from "../common";
import { FileUploader } from "ng2-file-upload";
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

            <th>Nombre</th>

            <th>Apellidos</th>

            <th>DNI/Nº Empleado</th>

            <th>Email</th>

            <th>Grupo/Empresa</th>

            <th>Rol</th>

            <th>State</th>

          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">

            <td>{{entity.userlogin}}</td>

            <td>{{entity.name}}</td>

            <td>{{entity.surname}}</td>

            <td>{{entity.identifier}}</td>

            <td>{{entity.email}}</td>

            <td>{{entity.group}}</td>

            <td>{{entity.roleId}}</td>

            <td>{{entity.state}}</td>

          <td class="actions">
            <a [routerLink]="['..', 'update', entity.id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
    <bb-button [routerLink]="['..', 'create']">
      <i class="fa fa-plus" aria-hidden="true"></i>
      Crear usuario
    </bb-button>
    <hr />
    <h4>Importar</h4>
    <input type="file" ng2FileSelect [uploader]="uploader" />
    <button type="button" class="btn btn-success btn-s"
            (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
        <span class="glyphicon glyphicon-upload"></span> Subir CSV
    </button>

  </bb-section-content>
</bb-section>
<!-- <pre>entities: {{entities |json}}</pre> -->
  `,
})
export class ListUserComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<UserType>;

  uploader: FileUploader = new FileUploader({
    url: `${this.domain}/users/csv`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: /users");
    this.http.get(`${this.domain}/users`).subscribe(
      (response: Pagination<UserType>) => {
        console.log("<-- GET: /users", response);

        this.entities = Pagination.fromJSON<UserType>(UserType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: /users", errorResponse.json());
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
    console.log("--> DELETE: /users/:userId", row);
    this.http.delete(`${this.domain}/users/:userId`.replace(":userId", "" + row.id)).subscribe((response: Response) => {
      console.log("<-- DELETE: /users/:userId", response);
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
