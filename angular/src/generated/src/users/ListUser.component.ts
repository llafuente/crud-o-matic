import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { Pagination } from "../common";
import { UserType } from "../models/IUser";
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
            <a (click)="clone(i, entity)"><i class="fa fa-clone" aria-hidden="true"></i></a>
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
            (click)="startUpload()" [disabled]="!uploader.getNotUploadedItems().length">
        <span class="glyphicon glyphicon-upload"></span> Subir CSV
    </button>

    <div class="progress" *ngIf="uploading">
        <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
    </div>

  </bb-section-content>
</bb-section>
<!-- <pre>entities: {{entities |json}}</pre> -->
  `,
})
export class ListUserComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<UserType>;

  uploading: boolean = false;
  uploader: FileUploader = new FileUploader({
    url: `${this.domain}/api/v1/users/csv`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public http: HttpClient,
  ) {
    super(injector, activatedRoute);

    //this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
    this.uploader.onCompleteAll = () => {
      //console.log("item uploaded", response);
      this.uploading = false;

      // TODO handle response: onErrorItem
      this.refresh();
    };

    this.refresh();
  }

  refresh() {
    console.log(`--> GET: ${this.domain}/api/v1/users`);
    this.http.get(`${this.domain}/api/v1/users`).subscribe(
      (response: Pagination<UserType>) => {
        console.log("<-- GET: ${this.domain}/api/v1/users", response);

        this.entities = Pagination.fromJSON<UserType>(UserType, response);
      },
      (errorResponse: Response) => {
        console.log(
          `<-- GET Error: ${this.domain}/api/v1/users`,
          errorResponse,
        );
        this.errorHandler(errorResponse);
      },
    );
  }

  startUpload() {
    this.uploading = true;
    this.uploader.uploadAll();
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: UserType) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> DELETE: ${this.domain}/api/v1/users/:userId`, row);
    this.http
      .delete(
        `${this.domain}/api/v1/users/:userId`.replace(":userId", "" + row.id),
      )
      .subscribe(
        (response: Response) => {
          console.log(
            `<-- DELETE: ${this.domain}/api/v1/users/:userId`,
            response,
          );
          this.entities.list.splice(idx, 1);
          this.loading = false;
        },
        (errorResponse: Response) => {
          console.log(
            `<-- DELETE Error: ${this.domain}/api/v1/users/:userId`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }

  clone(idx: number, row: UserType) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> CLONE: ${this.domain}/api/v1/users/:userId/clone`, row);
    this.http
      .post(
        `${this.domain}/api/v1/users/:userId/clone`.replace(
          ":userId",
          "" + row.id,
        ),
        {},
      )
      .subscribe(
        (response: Response) => {
          console.log(
            `<-- CLONE: ${this.domain}/api/v1/users/:userId/clone`,
            response,
          );

          this.loading = false;
          this.refresh();
        },
        (errorResponse: Response) => {
          console.log(
            `<-- CLONE Error: ${this.domain}/api/v1/users/:userId/clone`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }
}
