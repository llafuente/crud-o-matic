import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-card-example-component",
  templateUrl: "./BBModalExample.component.html",
  providers: [provideTemplateFrom(BBModalExampleComponent)],
})
export class BBModalExampleComponent {}
