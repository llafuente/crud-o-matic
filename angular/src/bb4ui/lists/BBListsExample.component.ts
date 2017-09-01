import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-lists-example-component",
  templateUrl: "./BBListsExample.component.html",
  providers: [provideTemplateFrom(BBListsExampleComponent)],
})
export class BBListsExampleComponent {}
