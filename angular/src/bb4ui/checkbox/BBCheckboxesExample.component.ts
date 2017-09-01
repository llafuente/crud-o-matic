import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-checkboxes-example-component",
  templateUrl: "./BBCheckboxesExample.component.html",
  providers: [provideTemplateFrom(BBCheckboxesExampleComponent)]
})
export class BBCheckboxesExampleComponent {
  checkboxes: any = {
    check3: true
  };
}
