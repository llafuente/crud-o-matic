import { HttpClient } from "@angular/common/http";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public router: Router,
  ) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading

    this.http.get(`${this.domain}/tests`).subscribe(
      (response: any) => {
        console.log(
          `<-- GET: ${this.domain}/tests`,
          JSON.stringify(response, null, 2),
        );

        this.tests = response;

        // TODO this is not safe for nested properties, need a fix :)
        if (this.entity.testId === undefined) {
          if (response.list.length) {
            this.entity.testId = response.list[0].id;
          }
        } else {
          // TODO check some are valid, if not nullify
        }
      },
      (errorResponse: Response) => {
        console.log(`<-- GET Error: ${this.domain}/tests`, errorResponse);
      },
    );
  }

  save() {
    console.log(
      `--> POST: ${this.domain}/vouchers`,
      JSON.stringify(this.entity, null, 2),
    );
    this.http.post(`${this.domain}/vouchers`, this.entity).subscribe(
      (response: VoucherType) => {
        console.log(
          "<-- POST: ${this.domain}/vouchers",
          JSON.stringify(response, null, 2),
        );

        this.router.navigate(["..", "list"], {
          relativeTo: this.activatedRoute,
        });
      },
      (errorResponse: Response) => {
        console.log(`<-- POST Error: ${this.domain}/vouchers`, errorResponse);
        this.errorHandler(errorResponse);
      },
    );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
