import { Component, HostBinding, Input } from "@angular/core";

@Component({
  selector: "bb-button",
  templateUrl: "./BBButton.component.html"
})
export class BBButtonComponent {
  @HostBinding("class.disabled")
  @Input()
  disabled: boolean;
  @Input() btn = "primary";
}
