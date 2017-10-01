import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { <%= typeName %> } from '../models/<%= interfaceName %>';

/**
 */
@Component({
  selector: <%- JSON.stringify(selector) %>,
  template: `
<%- template %>
`,
})
export class <%= componentName %> extends BaseComponent implements OnInit {
  loading: false;
  id: string;
  entity: <%= typeName %> = new <%= typeName %>();

  <%- declarations %>

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: HttpClient,
    public router: Router,
  ) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
    <%- initialization %>
  }

  <%- methods %>
}
