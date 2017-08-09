import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-inputs-example-component",
  templateUrl: "./BBInputsExample.component.html",
  providers: [provideTemplateFrom(BBInputsExampleComponent)],
})
export class BBInputsExampleComponent {
  inputs: any = {
    isDisabled: true,
    isRequired: true,
  };
  entity: any = {
    textarea:
      "Bacon ipsum dolor amet cow short ribs jowl ribeye fatback. Pork spare ribs boudin kevin capicola sirloin leberkas flank cow pig. Leberkas frankfurter bresaola chicken ground round porchetta, tri-tip filet mignon alcatra short loin pig rump pork loin kielbasa. Doner bacon fatback, shank spare ribs shoulder sirloin pork filet mignon. Corned beef beef spare ribs, cow prosciutto pig kevin andouille tongue capicola jerky pork rump ribeye filet mignon. Turducken shoulder burgdoggen, tail beef jerky chuck corned beef boudin pork belly swine.",
  };
  switches: any = {}
}
