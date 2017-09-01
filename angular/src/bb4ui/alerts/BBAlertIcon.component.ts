import { Component, Input } from "@angular/core";

@Component({
  selector: "bb-alert-icon",
  templateUrl: "./BBAlertIcon.component.html"
})
export class BBAlertIconComponent {
  @Input() header: string = null;
  @Input() type = "default";
  // css classes
  @Input("icon-class") iconClass = "fa fa-exclamation-triangle";
}
