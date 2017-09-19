import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-alerts-example-component",
  templateUrl: "./BBAlertsExample.component.html",
  providers: [provideTemplateFrom(BBAlertsExampleComponent)],
})
export class BBAlertsExampleComponent {
  alerts: string[] = [
    "default",
    "success",
    "info",
    "warning",
    "danger",
    "promo",
  ];
}
