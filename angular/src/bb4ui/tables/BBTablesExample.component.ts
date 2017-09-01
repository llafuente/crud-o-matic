import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-tables-example-component",
  templateUrl: "./BBTablesExample.component.html",
  providers: [provideTemplateFrom(BBTablesExampleComponent)],
})
export class BBTablesExampleComponent {}
