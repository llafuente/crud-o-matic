import { Component } from "@angular/core";
import { provideTemplateFrom } from "../examples/BBSourceExample.component";

@Component({
  selector: "bb-card-example-component",
  templateUrl: "./BBCardExample.component.html",
  providers: [provideTemplateFrom(BBCardExampleComponent)],
})
export class BBCardExampleComponent {
  toogles: any = {};
  loading = true;
  loading2 = false;
  error2 = true;
  sectionEvents: any = {
    onLoad: 0,
    onRefresh: 0,
  };

  toogle(src, isCollapsed) {
    this.toogles[src] = this.toogles[src] || { collapsed: 0, open: 0 };
    ++this.toogles[src][isCollapsed ? "collapsed" : "open"];
  }

  onLoadExample1() {
    ++this.sectionEvents.onLoad;
  }
}
