import { Component, Input } from "@angular/core";
import { NgModel } from "@angular/forms";
import { BBErrorMessages } from "./BBErrorMessages.service";

// <pre>valid? {{model.valid | json}} dirty? {{model.dirty | json}} touched? {{model.touched | json}}</pre>

@Component({
  selector: "bb-errors",
  template: `
<div class="alert alert-danger" *ngIf="!model.valid && (model.dirty || model.touched)">
  <div *ngIf="model?.errors?.required" class="form-control-feedback">{{ messages.required }}</div>
  <div *ngIf="model?.errors?.minlength" class="form-control-feedback">{{ messages.minlength }}</div>
  <div *ngIf="model?.errors?.maxlength" class="form-control-feedback">{{ messages.maxlength }}</div>
  <div *ngIf="model?.errors?.email" class="form-control-feedback">{{ messages.email }}</div>
  <div *ngIf="model?.errors?.url" class="form-control-feedback">{{ messages.url }}</div>
  <div *ngIf="model?.errors?.pattern" class="form-control-feedback">{{ pattern || messages.pattern }}</div>
</div>
  `,
})
export class BBErrorsComponent {
  // required
  @Input() model: NgModel;
  // override pattern message
  @Input() pattern: string;

  constructor(public messages: BBErrorMessages) {}
}
