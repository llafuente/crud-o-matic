import { Component, HostBinding, Input } from "@angular/core";

// NOTE all whitespace removal (no identation) it's on purpose
// to support css :empty
@Component({
  selector: "bb-card",
  template: `
<div class="card d-flex flex-column" style="flex: 1">
  <div class="card-header"><h2 *ngIf="header">{{ header }}</h2></div>

  <div class="card-block"><ng-content select="bb-section-content"></ng-content></div>

  <div class="card-footer mt-auto"><ng-content select="bb-section-footer"></ng-content></div>
</div>

  `,
})
export class BBCardComponent {
  @Input() header: string;
  @HostBinding("style.flex") private x = 1;
}
