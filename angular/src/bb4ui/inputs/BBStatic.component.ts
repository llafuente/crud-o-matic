import { Component, HostBinding, Input } from "@angular/core";

@Component({
  selector: "bb-static",
  templateUrl: "./BBStatic.component.html",
  host: {
    class: "form-control-container focused",
  },
})
export class BBStaticComponent {
  // optional
  @Input() label: string;

  @Input() size: string;
  @Input() inline: string;
  @Input() help: string;

  @HostBinding("class.notempty") notEmpty = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.size && ["sm", "lg"].indexOf(this.size) === -1) {
      throw new Error("bb-input: size must be sm or lg");
    }
  }
}
