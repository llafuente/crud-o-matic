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
            <a (click)="clone(i, entity)"><i class="fa fa-clone" aria-hidden="true"></i></a>
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
export class <%= frontend.listComponent %> extends BaseComponent implements OnInit {
  loading: boolean = false;
  entities: Pagination<<%= typeName %>>;

  uploading: boolean = false;
  uploader:FileUploader = new FileUploader({
    url: `<%- url('IMPORT', true) %>`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: HttpClient,
  ) {
    super(injector, activatedRoute);

    // this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
    this.uploader.onCompleteAll = () => {
      // console.log("item uploaded", response);
      this.uploading = false;

      // TODO handle response: onErrorItem
      this.refresh();
    };

    this.refresh();
  }

  refresh() {
    console.log(`--> GET: <%- url('LIST', true) %>`);
    this.http.get(`<%- url('LIST', true) %>`)
    .subscribe((response: Pagination<<%= typeName %>>) => {
      console.log(`<-- GET: <%- url('LIST', true) %>`, response);

      this.entities = Pagination.fromJSON<<%= typeName %>>(<%= typeName %>, response);
    }, (errorResponse: Response) => {
      console.log(`<-- GET Error: <%- url('LIST', true) %>`, errorResponse);
      this.errorHandler(errorResponse);
    });
  }

  startUpload() {
    this.uploading = true;
    this.uploader.uploadAll()
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: <%= typeName %>) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> DELETE: <%- url('DELETE', true) %>`, row);
    this.http.delete(`<%- url('DELETE', true) %>`.replace(":<%= entityId %>", "" + row.id))
    .subscribe((response: Response) => {
      console.log(`<-- DELETE: <%- url('DELETE', true) %>`, response);
      this.entities.list.splice(idx, 1);
      this.loading = false;
    }, (errorResponse: Response) => {
      console.log(`<-- DELETE Error: <%- url('DELETE', true) %>`, errorResponse);
      this.errorHandler(errorResponse);
    });
  }

  clone(idx: number, row: <%= typeName %>) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> CLONE: <%- url('CLONE', true) %>`, row);
    this.http.post(`<%- url('CLONE', true) %>`.replace(":<%= entityId %>", "" + row.id), {})
    .subscribe((response: Response) => {
      console.log(`<-- CLONE: <%- url('CLONE', true) %>`, response);

      this.loading = false;
      this.refresh();
    }, (errorResponse: Response) => {
      console.log(`<-- CLONE Error: <%- url('CLONE', true) %>`, errorResponse);
      this.errorHandler(errorResponse);
    });
  }
}
