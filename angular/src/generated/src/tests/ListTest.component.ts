import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { Pagination } from "../common";
import { TestType } from "../models/ITest";
/**
 */
@Component({
  selector: "test-create-component",
  template: `
<bb-section>
  <bb-section-header>Listado de exámenes</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>

            <th>Nombre del examén</th>

            <th>Instrucciones</th>

            <th>Aleatorizar respuestas</th>

            <th>Bloques de conocimiento</th>

            <th>Tiempo máximo (minutos)</th>

            <th>Usuarios inscritos</th>

            <th>Usuarios que realizaron el examen</th>

          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">

            <td>{{entity.label}}</td>

            <td>{{entity.instructions}}</td>

            <td>{{entity.randomizeAnwers}}</td>

            <td>{{entity.blocks}}</td>

            <td>{{entity.maxTime}}</td>

            <td>{{entity.usersSubscribed}}</td>

            <td>{{entity.usersDone}}</td>

          <td class="actions">
            <a [routerLink]="['..', 'update', entity.id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
    <bb-button [routerLink]="['..', 'create']">
      <i class="fa fa-plus" aria-hidden="true"></i>
      Crear examen
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
export class ListTestComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<TestType>;

  uploader: FileUploader = new FileUploader({
    url: `${this.domain}/api/v1/tests/csv`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public http: HttpClient,
  ) {
    super(injector, activatedRoute);

    console.log(`--> GET: ${this.domain}/api/v1/tests`);
    this.http.get(`${this.domain}/api/v1/tests`).subscribe(
      (response: Pagination<TestType>) => {
        console.log("<-- GET: ${this.domain}/api/v1/tests", response);

        this.entities = Pagination.fromJSON<TestType>(TestType, response);
      },
      (errorResponse: Response) => {
        console.log(
          `<-- GET Error: ${this.domain}/api/v1/tests`,
          errorResponse,
        );
        this.errorHandler(errorResponse);
      },
    );
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: TestType) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> DELETE: ${this.domain}/api/v1/tests/:testId`, row);
    this.http
      .delete(
        `${this.domain}/api/v1/tests/:testId`.replace(":testId", "" + row.id),
      )
      .subscribe(
        (response: Response) => {
          console.log(
            `<-- DELETE: ${this.domain}/api/v1/tests/:testId`,
            response,
          );
          this.entities.list.splice(idx, 1);
          this.loading = false;
        },
        (errorResponse: Response) => {
          console.log(
            `<-- DELETE Error: ${this.domain}/api/v1/tests/:testId`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }
}
