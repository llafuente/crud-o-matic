import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-typography-example-component",
  templateUrl: "./BBTypographyExample.component.html",
  providers: [provideTemplateFrom(BBTypographyExampleComponent)],
})
export class BBTypographyExampleComponent {
  public example1 = "";
}
