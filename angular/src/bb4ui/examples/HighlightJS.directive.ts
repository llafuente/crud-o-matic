import { AfterViewChecked, Directive, ElementRef, Input, NgZone, OnInit } from "@angular/core";

declare var hljs: any;

@Directive({
  selector: "code[highlightjs]"
})
export class HighlightJSDirective implements OnInit, AfterViewChecked {
  @Input() useBr = false;

  constructor(private elementRef: ElementRef, private zone: NgZone) {}

  ngOnInit() {}

  ngAfterViewChecked() {
    if (this.elementRef.nativeElement.innerHTML && this.elementRef.nativeElement.querySelector) {
      console.log(this.elementRef.nativeElement.innerHTML);
      this.zone.runOutsideAngular(() => {
        hljs.configure({ useBR: this.useBr });
        hljs.highlightBlock(this.elementRef.nativeElement);
      });
    }
  }
}
