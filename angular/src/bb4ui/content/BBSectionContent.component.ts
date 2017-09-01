import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "bb-section-content",
  template: `
<div *ngIf="loading">

  <div class="progress progress-loop">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
  </div>

  <bb-alert class="text-center" [type]="null" style="margin-top: 16px;" *ngIf="loadingMessage">
    <p>{{loadingMessage}}</p>
  </bb-alert>
</div>
<div *ngIf="!error && !loading">
  <ng-content></ng-content>
</div>
<div *ngIf="error && !loading" class="container text-center">
  <p><i class="ico-cm_alert"></i> {{error === true ? 'Error al obtener la informacion solicitada.' : error}}</p>
  <bb-button
    (click)="doReload()"
  ><i class="fa fa-refresh "></i> Volver a interntarlo</bb-button>
</div>
  `
})
export class BBSectionContentComponent implements OnInit {
  @Output() onReload: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoad: EventEmitter<any> = new EventEmitter<any>();
  @Input() loading: boolean;
  @Input() loadingMessage: string;
  @Input() error: any;

  ngOnInit() {
    this.onLoad.next(null);
  }

  doReload() {
    this.onReload.next(null);
  }
}
