import { Component, Input, OnInit, Injector } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { VoucherType } from "../models/IVoucher";
import { Pagination } from "../common";

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
    <bb-button [routerLink]="['..', 'create']">Create</bb-button>
  </bb-section-content>
</bb-section>
<!-- <pre>entities: {{entities |json}}</pre> -->
  `,
})
export class ListVoucherComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<VoucherType>;

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient) {
    super(injector, activatedRoute);

    console.log("--> GET: http://localhost:3004/vouchers");
    this.http.get("http://localhost:3004/vouchers").subscribe(
      (response: Pagination<VoucherType>) => {
        console.log("<-- GET: http://localhost:3004/vouchers", response);

        this.entities = Pagination.fromJSON<VoucherType>(VoucherType, response);
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://localhost:3004/vouchers", errorResponse.json());
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
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: http://localhost:3004/vouchers/:voucherId", row);
    this.http
      .delete("http://localhost:3004/vouchers/:voucherId".replace(":voucherId", "" + row._id))
      .subscribe((response: Response) => {
        console.log("<-- DELETE: http://localhost:3004/vouchers/:voucherId", response);
        this.entities.list.splice(idx, 1);
        this.loading = false;
      });
  }
}
