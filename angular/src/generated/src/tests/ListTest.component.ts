import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { TestType } from "../models/ITest";
import { Pagination } from "../common";

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
    <bb-button [routerLink]="['..', 'create']">Create</bb-button>
  </bb-section-content>
</bb-section>
<!-- <pre>entities: {{entities |json}}</pre> -->
  `
})
export class ListTestComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<TestType>;

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: http://localhost:3004/tests");
    this.http.get("http://localhost:3004/tests").subscribe(
      (response: Pagination<TestType>) => {
        console.log("<-- GET: http://localhost:3004/tests", response);

        this.entities = Pagination.fromJSON<TestType>(TestType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://localhost:3004/tests", errorResponse.json());
      }
    );
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: TestType) {
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: http://localhost:3004/tests/:testId", row);
    this.http
      .delete("http://localhost:3004/tests/:testId".replace(":testId", "" + row._id))
      .subscribe((response: Response) => {
        console.log("<-- DELETE: http://localhost:3004/tests/:testId", response);
        this.entities.list.splice(idx, 1);
        this.loading = false;
      });
  }
}
