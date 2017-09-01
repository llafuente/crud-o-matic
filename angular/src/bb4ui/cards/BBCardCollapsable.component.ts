import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from "@angular/core";

// NOTE all whitespace removal (no identation) it's on purpose
// to support css :empty
@Component({
  selector: "bb-card-collapsable",
  template: `

<div class="card card-collapsable">
  <div (click)="toogle()" class="card-header">
    <div class="card-indicator">
      <i class="card-opened-icon" *ngIf="!collapsed"></i>
      <i class="card-closed-icon" *ngIf="collapsed"></i>
    </div>
    <h2>{{header}}</h2>
    <div class="clearfix"></div>
  </div>

  <div class="card-block" [ngStyle]="{'display': collapsed ? 'none' : 'block'}"><ng-content select="bb-section-content"></ng-content></div>

  <div class="card-footer mt-auto" [ngStyle]="{'display': collapsed ? 'none' : 'block'}"><ng-content select="bb-section-footer"></ng-content></div>
</div>

  `
})
export class BBCardCollapsableComponent implements OnInit {
  @Input() header: string;
  @Input() startCollapsed: boolean;
  @Input() uniqueid: string;
  // this is called on initialization
  // not only on user interaction
  // this allow to have a unique output :)
  // the boolean sent is if it's collapsed
  @Output() onToogle: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding("class.collapsed") collapsed: boolean;

  ngOnInit() {
    this.collapsed = this.startCollapsed === undefined ? true : !!this.startCollapsed;

    // check localStorage for the last state
    if (this.uniqueid !== undefined) {
      // search in the localStorage
      const jsonstr = sessionStorage.getItem("bb-card-collapsable");
      try {
        const json = JSON.parse(jsonstr) || {};
        if (json[this.uniqueid] !== undefined) {
          this.collapsed = json[this.uniqueid];
        }
      } catch (e) {}
    }

    this.onToogle.next(this.collapsed);
  }

  toogle() {
    this.collapsed = !this.collapsed;
    this.onToogle.next(this.collapsed);

    // check localStorage for the last state
    if (this.uniqueid !== undefined) {
      // search in the localStorage
      const jsonstr = sessionStorage.getItem("bb-card-collapsable");
      try {
        const json = JSON.parse(jsonstr) || {};
        json[this.uniqueid] = this.collapsed;
        sessionStorage.setItem("bb-card-collapsable", JSON.stringify(json));
      } catch (e) {}
    }
  }
}
