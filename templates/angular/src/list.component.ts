import { Component, Input, OnInit, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { <%= typeName %> } from '../models/<%= interfaceName %>';
import { Pagination } from '../common';
import { FileUploader } from 'ng2-file-upload';
/**
 */
@Component({
  selector: '<%= singular %>-create-component',
  template: `
<bb-section>
  <bb-section-header><%= frontend.listHeader %></bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>
          <%
            forEachFrontEndField((key, field) => {
              if (field.permissions.list) {
          %>
            <th><%= field.label %></th>
          <%
              }
            })
          %>
          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">
          <%
            forEachFrontEndField((key, field) => {
              if (field.permissions.list) {
          %>
            <td>{{entity.<%= key %>}}</td>
          <%
              }
            })
          %>
          <td class="actions">
            <a [routerLink]="['..', 'update', entity.id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
    <bb-button [routerLink]="['..', 'create']">
      <i class="fa fa-plus" aria-hidden="true"></i>
      <%= frontend.createHeader %>
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
export class <%= frontend.listComponent %> extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<<%= typeName %>>;

  uploader:FileUploader = new FileUploader({
    url: <%- JSON.stringify(url('IMPORT', true)) %>,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: HttpClient,
  ) {
    super(injector, activatedRoute);

    console.log("--> GET: <%= url('LIST', true) %>");
    this.http.get("<%= url('LIST', true) %>")
    .subscribe((response: Pagination<<%= typeName %>>) => {
      console.log("<-- GET: <%= url('LIST', true) %>", response);

      this.entities = Pagination.fromJSON<<%= typeName %>>(<%= typeName %>, response);
    }, (errorResponse: Response) => {
      console.log("<-- GET Error: <%= url('LIST', true) %>", errorResponse.json());
    });
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: <%= typeName %>) {
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: <%= url('DELETE', true) %>", row);
    this.http.delete("<%= url('DELETE', true) %>".replace(":<%= entityId %>", "" + row.id))
    .subscribe((response: Response) => {
      console.log("<-- DELETE: <%= url('DELETE', true) %>", response);
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
