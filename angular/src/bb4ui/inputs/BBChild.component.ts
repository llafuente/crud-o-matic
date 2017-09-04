import { Directive, ElementRef, Host, HostBinding, Input, Optional, Self } from "@angular/core";
import { NgControl } from "@angular/forms";
import { BBInputContainerComponent } from "./BBInputContainer.component";

function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== "false";
}

///
/// Directive placed on the child (input|textarea)
///
/// TODO readonly -> onfocus="this.blur()"
@Directive({
  selector: "input[bb-child], textarea[bb-child], select[bb-child]",
  host: {
    class: "form-control",
    "[required]": "required",
    "[disabled]": "disabled",
    "(input)": "onInput()",
  },
})
export class BBChildComponent {
  @HostBinding("class.form-control-lg") sizeLg: boolean; // declared at container
  @HostBinding("class.form-control-sm") sizeSm: boolean; // declared at container

  @Input()
  get required() {
    return this._required;
  }
  set required(value: any) {
    this.parent.required = this._required = coerceBooleanProperty(value);
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this.parent.disabled = this._disabled = coerceBooleanProperty(value);
  }

  focused = false;

  private _required = false;
  private _disabled = false;

  constructor(
    @Host() public parent: BBInputContainerComponent,
    @Optional()
    @Self()
    public ngControl: NgControl,
    public element: ElementRef,
  ) {
    if (!this.parent) {
      throw new Error("bb-child require a bb-input-container as parent");
    }
    this.parent.child = this;
  }

  ngOnInit(): void {
    // NOTE use both events at the same time :)
    this.element.nativeElement.onfocusout = () => {
      this.parent.focused = false;
    };
    this.element.nativeElement.onblur = () => {
      this.parent.focused = false;
    };
    this.element.nativeElement.onfocus = () => {
      this.parent.focused = true;
    };

    this.ngControl.valueChanges.subscribe(this.onInput.bind(this));

    // TODO listen ?
    this.sizeLg = this.parent.size === "lg";
    this.sizeSm = this.parent.size === "sm";

    // foward value && type to parent
    this.onInput();
  }

  ngOnDestroy() {
    // TODO why i cant unsubscibe ?!?!
  }

  ngAfterViewInit(): void {}

  onInput() {
    const type = this.element.nativeElement.type;
    switch (type) {
      // some inputs has format as placeholder
      // so move label up
      case "date":
      case "time":
      case "month":
      case "week":
      case "datetime-local":
        this.parent.setNotEmpty(true);
        break;
      default:
        const val = this.element.nativeElement.value;

        if (val === undefined || val === null || val === "") {
          this.parent.setNotEmpty(false);
        } else {
          this.parent.setNotEmpty(true);
        }
    }
  }
}
