import { Component } from "@angular/core";

// this component is used to create empty routes with children
// the children will handle base path
@Component({
  template: "<router-outlet></router-outlet>",
})
export class RootComponent {}
