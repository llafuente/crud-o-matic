import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-radios-example-component",
  templateUrl: "./BBRadiosExample.component.html",
  providers: [provideTemplateFrom(BBRadiosExampleComponent)],
})
export class BBRadiosExampleComponent {
  radios: any = {
    radio0: true,
  };
}
