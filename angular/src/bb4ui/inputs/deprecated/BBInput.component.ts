import { Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgModel } from "@angular/forms";

const noop = () => {};

const BBInputmodelVALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBInputComponent),
  multi: true
};

// NOTE name is not necessary
// because we have a reference to ngModel, don't need to fetch it from ngForm
// NOTE label for is also removed, because input name is also removed
@Component({
  selector: "bb-input",
  templateUrl: "./BBInput.component.html",
  providers: [BBInputmodelVALUE_ACCESSOR]
})
export class BBInputComponent implements ControlValueAccessor {
  // required
  @Input() name: string;

  // optional
  @Input() label: string;
  @Input() placeholder: string;

  @Input() type = "text";
  @Input() inline: string;
  @Input() help: string;

  @Input() preAddon: string;
  @Input() postAddon: string;
  @Input() size: string;

  // validation
  @Input() disabled: boolean;
  @Input() required: boolean;

  @ViewChild(NgModel) model: NgModel;
  @ViewChild("input") input: ElementRef;

  @HostBinding("class.focused") focused = false;

  @HostBinding("class.notempty") notEmpty = false;

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;
  private modelValue: string;

  ngOnInit(): void {
    this.placeholder = this.placeholder || "";
    // preAddong occupy the same space as label, so if found move label up
    this.notEmpty = !!this.preAddon;
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.onfocusout = () => {
      this.focused = false;
    };
    this.input.nativeElement.onfocus = () => {
      this.focused = true;
    };

    if (this.size && ["sm", "lg"].indexOf(this.size) === -1) {
      throw new Error("bb-input: size must be sm or lg");
    }

    if (!this.name) {
      throw new Error("bb-input:name is required");
    }

    console.log("bb-input: ngAfterViewInit", this.name, this.model);
  }

  // @ControlValueAccessor interface

  writeValue(value: any) {
    console.log("value", value);
    this.modelValue = value;
    this._onChangeCallback(value);

    this.notEmpty = !!this.preAddon || (value !== undefined && !!("" + value).length);
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
}
