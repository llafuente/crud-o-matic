import { Component, Input } from "@angular/core";

@Component({
  selector: "bb-table",
  template: `
  <table
    class="table"
    [class.table-sm]="condensed === true"
    [class.table-inverse]="inverse === true"
    [class.table-hover]="hover === true"
    [class.table-striped]="striped === true"
    [class.table-bordered]="bordered === true">
    <ng-content></ng-content>
  </table>
  `,
})
export class BBTableComponent {
  @Input() condensed: boolean;
  @Input() inverse: boolean;
  @Input() striped = true;
  @Input() bordered = true;
  @Input() hover = true;
}
