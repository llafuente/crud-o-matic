import { Component, forwardRef, Input, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgModel } from "@angular/forms";

const noop = () => {};

const BBCheckModelValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBCheckBaseComponent),
  multi: true,
};

// abstract component

@Component({
  selector: "bb-check",
  template: "<div></div>",
  providers: [BBCheckModelValueAccessor],
})
export class BBCheckBaseComponent implements ControlValueAccessor {
  // validation
  @Input() disabled: boolean;
  @Input() required: boolean;

  @Input("true-value") trueValue: any = true;
  @Input("false-value") falseValue: any = false;

  @ViewChild(NgModel) model: NgModel;
  modelValue: string;
  boolModelValue: boolean;

  _onTouchedCallback: () => void = noop;
  _onChangeCallback: (_: any) => void = noop;

  writeValue(value: any) {
    // console.log('value', value);

    if (value === true || value === this.trueValue) {
      this.modelValue = this.trueValue;
      this.boolModelValue = true;
    } else {
      this.modelValue = this.falseValue;
      this.boolModelValue = false;
    }

    this._onChangeCallback(this.modelValue);
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
}
