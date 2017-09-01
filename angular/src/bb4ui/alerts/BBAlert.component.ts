import { Component, Input } from "@angular/core";

@Component({
  selector: "bb-alert",
  templateUrl: "./BBAlert.component.html",
})
export class BBAlertComponent {
  @Input() header: string = null;
  @Input() type = "default";
}
