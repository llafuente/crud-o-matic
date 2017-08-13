import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { VoucherType } from '../models/IVoucher';

/**
 */
@Component({
  selector: 'voucher-create-component',
  template: `
<div>
<form #f="ngForm" novalidate>
  <bb-static label="Fecha de inicio">
{{entity.startAt | date }}
</bb-static>

<datepicker
  id="id-startAt"
  name="startAt"
  [(ngModel)]="entity.startAt"
  [showWeeks]="false"
  #startAtModel="ngModel"></datepicker>
<!--
  [minDate]="minDate"
  [showWeeks]="true"
  [dateDisabled]="dateDisabled"
-->
<bb-errors [model]="startAtModel"></bb-errors>

<bb-static label="Fecha de fin">
{{entity.endAt | date }}
</bb-static>

<datepicker
  id="id-endAt"
  name="endAt"
  [(ngModel)]="entity.endAt"
  [showWeeks]="false"
  #endAtModel="ngModel"></datepicker>
<!--
  [minDate]="minDate"
  [showWeeks]="true"
  [dateDisabled]="dateDisabled"
-->
<bb-errors [model]="endAtModel"></bb-errors>

<bb-check
  id="id-canDownload"
  name="canDownload"
  [(ngModel)]="entity.canDownload">Permitir descargar manuales</bb-check>

<bb-input-container label="Máximos usos">
  <input
    bb-child
    type="number"
    step="1"
    id="id-maxUses"
    name="maxUses"
    [(ngModel)]="entity.maxUses"
    #maxUsesModel="ngModel"
    />

    <bb-errors [model]="maxUsesModel"></bb-errors>

</bb-input-container>

<bb-static label="Usos">
{{entity.currentUses | date }}
</bb-static>

  <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
  <bb-button (click)="save()">Guardar</bb-button>
</form>
<pre>entity: {{entity | json}}</pre>
</div>
  `,
})
export class CreateVoucherComponent extends BaseComponent {
  loading: false;
  id: number;
  entity: VoucherType = new VoucherType();

  

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
  }

  save() {
    console.log("--> POST: http://localhost:3004/vouchers", JSON.stringify(this.entity, null, 2));
    this.http.post("http://localhost:3004/vouchers", this.entity)
    .subscribe((response: VoucherType) => {
      console.log("<-- POST: http://localhost:3004/vouchers", JSON.stringify(response, null, 2));

      this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });

    }, (errorResponse: Response) => {
      console.log("<-- POST Error: http://localhost:3004/vouchers", errorResponse);
    });
  }

  // for lists
  push(model: any[]) {
    model.push({});
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
