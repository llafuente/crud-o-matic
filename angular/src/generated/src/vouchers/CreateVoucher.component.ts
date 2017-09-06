import { Component, Input, OnInit, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { VoucherType } from "../models/IVoucher";

/**
 */
@Component({
  selector: "create-vouchers-component",
  template: `

<bb-section>
  <bb-section-header>Crear voucher</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Etiqueta"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-label"
    name="label"

    [(ngModel)]="entity.label"
    #label="ngModel"
    />

    <bb-errors [model]="label"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Código"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-key"
    name="key"

    [(ngModel)]="entity.key"
    #key="ngModel"
    />

    <bb-errors [model]="key"></bb-errors>

</bb-input-container>

<bb-static label="Fecha de inicio">
{{entity.startAt | date }}
</bb-static>

<datepicker
  id="id-startAt"
  name="startAt"

  [(ngModel)]="entity.startAt"
  [showWeeks]="false"
  #startAt="ngModel"></datepicker>
<!--
  [minDate]="minDate"
  [showWeeks]="true"
  [dateDisabled]="dateDisabled"
-->
<bb-errors [model]="startAt"></bb-errors>

<bb-static label="Fecha de fin">
{{entity.endAt | date }}
</bb-static>

<datepicker
  id="id-endAt"
  name="endAt"

  [(ngModel)]="entity.endAt"
  [showWeeks]="false"
  #endAt="ngModel"></datepicker>
<!--
  [minDate]="minDate"
  [showWeeks]="true"
  [dateDisabled]="dateDisabled"
-->
<bb-errors [model]="endAt"></bb-errors>

<bb-check
  id="id-canDownload"
  name="canDownload"

  [(ngModel)]="entity.canDownload">Permitir descargar manuales</bb-check>

<bb-input-container
  label="Máximos usos"

  class="bordered top-label">
  <input
    bb-child
    type="number"
    step="1"
    id="id-maxUses"
    name="maxUses"

    [(ngModel)]="entity.maxUses"
    #maxUses="ngModel"
    />

    <bb-errors [model]="maxUses"></bb-errors>

</bb-input-container>

<bb-static label="Usos" class="bordered top-label">
{{entity.currentUses | date }}
</bb-static>

<bb-input-container
  label="Test"

  class="bordered top-label">
  <select
    bb-child
    id="id-testId"
    name="testId"

    [(ngModel)]="entity.testId"
    #testId="ngModel">
    <option *ngFor="let row of tests?.list" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="testId"></bb-errors>

</bb-input-container>

      <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class CreateVoucherComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: VoucherType = new VoucherType();

  tests: any;

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading

    this.http.get("http://34.229.180.92:3004/tests").subscribe(
      (response: any) => {
        console.log("<-- GET: http://34.229.180.92:3004/tests", JSON.stringify(response, null, 2));

        this.tests = response;
      },
      (errorResponse: Response) => {
        console.log("<-- GET Error: http://34.229.180.92:3004/tests", errorResponse);
      },
    );
  }

  save() {
    console.log("--> POST: http://34.229.180.92:3004/vouchers", JSON.stringify(this.entity, null, 2));
    this.http.post("http://34.229.180.92:3004/vouchers", this.entity).subscribe(
      (response: VoucherType) => {
        console.log("<-- POST: http://34.229.180.92:3004/vouchers", JSON.stringify(response, null, 2));

        this.router.navigate(["..", "list"], { relativeTo: this.activatedRoute });
      },
      (errorResponse: Response) => {
        console.log("<-- POST Error: http://34.229.180.92:3004/vouchers", errorResponse);
      },
    );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
