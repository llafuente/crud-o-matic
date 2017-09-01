import { Component, Input, Output, EventEmitter, HostListener, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

// from: https://github.com/yuyang041060120/angular2-ui-switch
// adapted to our uses

// TODO extend from checkbox, to support true-value / false-value

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBSwitchComponent),
  multi: true
};

@Component({
  selector: "bb-switch",
  templateUrl: "./BBSwitch.component.html",
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]
})
export class BBSwitchComponent implements ControlValueAccessor {
  private onTouchedCallback = (v: any) => {};
  private onChangeCallback = (v: any) => {};

  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;

  @Input()
  set checked(v: boolean) {
    this._checked = v !== false;
  }

  get checked() {
    return this._checked;
  }

  @Input()
  set disabled(v: boolean) {
    this._disabled = v !== false;
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  set reverse(v: boolean) {
    this._reverse = v !== false;
  }

  get reverse() {
    return this._reverse;
  }

  @Input() size: string = "medium";
  @Output() change = new EventEmitter<boolean>();
  @Input() color: string = "rgb(100, 189, 99)";
  @Input() switchOffColor: string = "";
  @Input() switchColor: string = "#fff";
  defaultBgColor: string = "#fff";
  defaultBoColor: string = "#dfdfdf";

  @Input() checkedMessage: string = null;
  @Input() uncheckedkMessage: string = null;

  getSwitchColor() {
    if (this.reverse) return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
    return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
  }

  ngOnInit() {
    if (this.checkedMessage === null) {
      throw new Error("bb-switch requires checkedMessage");
    }

    if (this.uncheckedkMessage === null) {
      throw new Error("bb-switch requires uncheckedkMessage");
    }
  }

  onToggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.change.emit(this.checked);
    this.onChangeCallback(this.checked);
    this.onTouchedCallback(this.checked);
  }

  writeValue(obj: any): void {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
