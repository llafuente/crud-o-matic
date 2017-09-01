import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-tabs-example-component",
  templateUrl: "./BBTabsExample.component.html",
  providers: [provideTemplateFrom(BBTabsExampleComponent)]
})
export class BBTabsExampleComponent {}
