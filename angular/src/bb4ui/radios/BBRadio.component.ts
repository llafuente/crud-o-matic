import { Component, forwardRef, HostBinding, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const noop = () => {};

const BBRadioModelValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBRadioComponent),
  multi: true
};

@Component({
  selector: "bb-radio",
  templateUrl: "./BBRadio.component.html",
  providers: [BBRadioModelValueAccessor]
})
export class BBRadioComponent implements ControlValueAccessor {
  // required
  @Input() name: string;
  @Input() value: string | number;

  @HostBinding("class.disabled")
  @Input()
  disabled: boolean;

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;
  private modelValue: string | number = "";

  ngAfterViewInit(): void {
    if (!this.name) {
      throw new Error("bb-radio: name is required");
    }

    if (this.value === undefined) {
      throw new Error("bb-radio: value is required");
    }

    console.log("bb-radio: ngAfterViewInit", this.name);
  }

  clicked() {
    this.writeValue(this.value);
  }

  // @ControlValueAccessor interface
  writeValue(value: any) {
    console.log("writeValue", value);
    this.modelValue = value;
    this._onChangeCallback(value);
  }

  registerOnChange(fn: any) {
    console.log("registerOnChange", fn);
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    console.log("registerOnTouched", fn);
    this._onTouchedCallback = fn;
  }
}
