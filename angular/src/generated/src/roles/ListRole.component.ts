import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { RoleType } from "../models/IRole";
import { Pagination } from "../common";
import { FileUploader } from "ng2-file-upload";
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
    <bb-button [routerLink]="['..', 'create']">
      <i class="fa fa-plus" aria-hidden="true"></i>
      Crear Rol
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
export class ListRoleComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<RoleType>;

  uploader: FileUploader = new FileUploader({
    url: `${this.domain}/roles/csv`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: /roles");
    this.http.get(`${this.domain}/roles`).subscribe(
      (response: Pagination<RoleType>) => {
        console.log("<-- GET: /roles", response);

        this.entities = Pagination.fromJSON<RoleType>(RoleType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: /roles", errorResponse.json());
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
    console.log("--> DELETE: /roles/:roleId", row);
    this.http.delete(`${this.domain}/roles/:roleId`.replace(":roleId", "" + row.id)).subscribe((response: Response) => {
      console.log("<-- DELETE: /roles/:roleId", response);
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
