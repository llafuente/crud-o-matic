import { Component, HostBinding, Input } from "@angular/core";
import { BBChildComponent } from "./BBChild.component";

///
/// Component that wrap input element
///
@Component({
  selector: "bb-input-container",
  templateUrl: "./BBInputContainer.component.html",
  host: {
    class: "form-control-container",
  },
})
export class BBInputContainerComponent {
  // optional
  @Input() label: string;

  @Input() inline: string;
  @Input() help: string;

  @Input() preAddon: string;
  @Input() postAddon: string;
  @Input() size: string;

  // validation
  public disabled: boolean;
  public required: boolean;

  @HostBinding("class.focused") focused = false;

  @HostBinding("class.notempty") notEmpty = false;

  child: BBChildComponent;

  ngOnInit(): void {
    // preAddong occupy the same space as label, so if found move label up
    this.notEmpty = !!this.preAddon;
  }

  setNotEmpty(b: boolean) {
    this.notEmpty = !!this.preAddon || b;
  }

  ngAfterViewInit(): void {
    if (this.size && ["sm", "lg"].indexOf(this.size) === -1) {
      throw new Error("bb-input-container: size must be sm or lg");
    }

    if (!this.child) {
      throw new Error("bb-input-container requires a bb-child children");
    }
  }
}
