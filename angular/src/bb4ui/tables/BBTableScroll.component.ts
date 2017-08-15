import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  ContentChild,
  ContentChildren,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
} from "@angular/core";

declare var jQuery: any;
/**
 * NOTE only thead and tbody are valid children
 * Limitations: if header column > body column you must assign body the min-width
 * Limitations: Do not support different paddings in th/td
 */
@Component({
  selector: "bb-table-scroll",
  template: `
<div style="overflow-x: hidden" #container>
  <table
    class="table table-scroll-header"
    [class.table-sm]="condensed === true"
    [class.table-inverse]="inverse === true"
    [class.table-hover]="hover === true"
    [class.table-striped]="striped === true"
    [class.table-bordered]="bordered === true">
    <ng-content select="thead"></ng-content>
  </table>
  <div [style.height]="height" style="overflow-x: visible; overflow-y: scroll">
    <table
      class="table table-scroll-body"
      [class.table-sm]="condensed === true"
      [class.table-inverse]="inverse === true"
      [class.table-hover]="hover === true"
      [class.table-striped]="striped === true"
      [class.table-bordered]="bordered === true">
      <ng-content select="tbody"></ng-content>
    </table>
  </div>
</div>

  `,
})
export class BBTableScrollComponent implements OnDestroy {
  @Input() condensed: boolean;
  @Input() inverse: boolean;
  @Input() striped: boolean = true;
  @Input() bordered: boolean = true;
  @Input() hover: boolean = true;

  @Input() scroll: boolean = false;
  @Input() height: string = "150px";

  thead: HTMLHtmlElement;
  tbody: HTMLHtmlElement;

  resizeBound: Function;
  interval: any;

  @ViewChild("container") container: ElementRef;

  constructor(public element: ElementRef) {
    this.resizeBound = this.resize.bind(this);
    this.interval = setInterval(this.resizeBound, 1000);
  }

  ngOnInit() {
    this.getThead().children("tr").append(jQuery("<th class=\"scroll\"></th>"));
  }

  getThead() {
    return jQuery(this.container.nativeElement).children("table").children("thead");
  }

  resize() {
    console.log(this.container.nativeElement);

    // Get the tbody columns width array
    const bodyTDs = jQuery(this.container.nativeElement)
      .children("div")
      .children("table")
      .children("tbody")
      .children("tr:first")
      .children("td,th");
    const headTHs = this.getThead().children("tr").children("th");

    //console.log(bodyTDs);
    const cols = [];

    bodyTDs.each(function(i, v) {
      //console.log(jQuery(v).width(), v);
      //cols.push(jQuery(v).width());
      cols.push(v.clientWidth);
    });
    //console.log(cols);

    // Set the width of thead columns
    headTHs.each(function(i, v) {
      console.log(i, cols[i], v);
      jQuery(v).css("width", cols[i]);
    });
  }

  ngAfterContentInit() {
    jQuery(window).bind("resize", this.resizeBound).resize(); // Trigger resize handler
    setTimeout(this.resizeBound, 200);
  }

  ngOnDestroy() {
    jQuery(window).unbind("resize", this.resizeBound);
    clearInterval(this.interval);
  }
}
