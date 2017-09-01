import { Component } from "@angular/core";

// hack aware!
// to remove the border of this component we look for how many
// children it has, <=3 should means empty (3 TextNodes with all spaces)
// before/after ng-content and one for the empty bb-section-footer
@Component({
  selector: "bb-section-footer",
  template: `
  <div class="bb-section-footer-container" [hidden]="ref.childNodes.length <= 3" #ref>
    <ng-content></ng-content>
  </div>
  `
})
export class BBSectionFooterComponent {}
