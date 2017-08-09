import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-button-example-component",
  templateUrl: "./BBButtonExample.component.html",
  providers: [provideTemplateFrom(BBButtonExampleComponent)],
})
export class BBButtonExampleComponent {}
