import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { Pagination } from "../common";
import { VoucherType } from "../models/IVoucher";
/**
 */
@Component({
  selector: "voucher-create-component",
  template: `
<bb-section>
  <bb-section-header>Listado de vouchers</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>

            <th>Etiqueta</th>

            <th>Código</th>

            <th>Fecha de inicio</th>

            <th>Fecha de fin</th>

            <th>Permitir descargar manuales</th>

            <th>Máximos usos</th>

            <th>Usos</th>

            <th>Test</th>

          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">

            <td>{{entity.label}}</td>

            <td>{{entity.key}}</td>

            <td>{{entity.startAt}}</td>

            <td>{{entity.endAt}}</td>

            <td>{{entity.canDownload}}</td>

            <td>{{entity.maxUses}}</td>

            <td>{{entity.currentUses}}</td>

            <td>{{entity.testId}}</td>

          <td class="actions">
            <a [routerLink]="['..', 'update', entity.id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
    <bb-button [routerLink]="['..', 'create']">
      <i class="fa fa-plus" aria-hidden="true"></i>
      Crear voucher
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
export class ListVoucherComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<VoucherType>;

  uploader: FileUploader = new FileUploader({
    url: `${this.domain}/vouchers/csv`,
    authToken: "Bearer " + localStorage.getItem("access_token"), // this is just an easy hack to use it
  });

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public http: HttpClient,
  ) {
    super(injector, activatedRoute);

    console.log(`--> GET: ${this.domain}/vouchers`);
    this.http.get(`${this.domain}/vouchers`).subscribe(
      (response: Pagination<VoucherType>) => {
        console.log("<-- GET: ${this.domain}/vouchers", response);

        this.entities = Pagination.fromJSON<VoucherType>(VoucherType, response);
      },
      (errorResponse: Response) => {
        console.log(`<-- GET Error: ${this.domain}/vouchers`, errorResponse);
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

  destroy(idx: number, row: VoucherType) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    console.log(`--> DELETE: ${this.domain}/vouchers/:voucherId`, row);
    this.http
      .delete(
        `${this.domain}/vouchers/:voucherId`.replace(":voucherId", "" + row.id),
      )
      .subscribe(
        (response: Response) => {
          console.log(
            `<-- DELETE: ${this.domain}/vouchers/:voucherId`,
            response,
          );
          this.entities.list.splice(idx, 1);
          this.loading = false;
        },
        (errorResponse: Response) => {
          console.log(
            `<-- DELETE Error: ${this.domain}/vouchers/:voucherId`,
            errorResponse,
          );
          this.errorHandler(errorResponse);
        },
      );
  }
}
