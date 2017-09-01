import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-badges-example-component",
  templateUrl: "./BBBadgesExample.component.html",
  providers: [provideTemplateFrom(BBBadgesExampleComponent)],
})
export class BBBadgesExampleComponent {}
