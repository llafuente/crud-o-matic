import { Component, Input, Output, EventEmitter, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BBCheckBaseComponent } from "../checkbox/BBCheckBase.component";

// styles from: https://github.com/yuyang041060120/angular2-ui-switch

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BBSwitchComponent),
  multi: true
};

@Component({
  selector: 'bb-switch',
  templateUrl: './BBSwitch.component.html',
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]
})
export class BBSwitchComponent extends BBCheckBaseComponent {
  private _disabled: boolean;
  private _reverse: boolean;

  @Input() set disabled(v: boolean) {
    this._disabled = v !== false;
  };

  get disabled() {
    return this._disabled;
  }

  @Input() set reverse(v: boolean) {
    this._reverse = v !== false;
  };

  get reverse() {
    return this._reverse;
  }

  @Input() name: string = null;
  @Input() checkedMessage: string = null;
  @Input() uncheckedkMessage: string = null;

  @Input() size: string = 'medium';
  @Output() change = new EventEmitter<boolean>();
  @Input() color: string = 'rgb(100, 189, 99)';
  @Input() switchOffColor: string = '';
  @Input() switchColor: string = '#fff';
  defaultBgColor: string = '#fff';
  defaultBoColor: string = '#dfdfdf';


  getSwitchColor() {
    if (this.reverse) return !this.boolModelValue ? this.switchColor : this.switchOffColor || this.switchColor;
    return this.boolModelValue ? this.switchColor : this.switchOffColor || this.switchColor;
  }

  ngAfterViewInit() {
    if (!this.name) {
      throw new Error("bb-switch: name is required");
    }

    if (this.checkedMessage === null) {
      throw new Error("bb-switch requires checkedMessage");
    }

    if (this.uncheckedkMessage === null) {
      throw new Error("bb-switch requires uncheckedkMessage");
    }
  }
}
