import { Component, forwardRef, Input, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgModel } from "@angular/forms";
import { BBCheckBaseComponent } from "./BBCheckBase.component";

const noop = () => {};

const BBCheckModelValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBCheckComponent),
  multi: true
};

@Component({
  selector: "bb-check",
  templateUrl: "./BBCheck.component.html",
  providers: [BBCheckModelValueAccessor]
})
export class BBCheckComponent extends BBCheckBaseComponent {
  // required
  @Input() name: string;

  @Input() label: string;
  @Input() placeholder: string;

  ngOnInit(): void {
    this.placeholder = this.placeholder || "";
  }

  ngAfterViewInit(): void {
    if (!this.name) {
      throw new Error("bb-check: name is required");
    }

    // console.log('bb-check: ngAfterViewInit', this.name, this.model);
  }
}
