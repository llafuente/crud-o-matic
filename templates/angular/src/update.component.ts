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
  selector: '<%= singular %>-update-component',
  template: `
<div>
<pre>entity: {{entity | json}}</pre>
</div>
  `,
})
export class <%= frontend.updateComponent %> extends BaseComponent {
  loading: false;
  id: string;
  entity: <%= typeName %> = new <%= typeName %>();

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: HttpClient,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    //this.id = parseInt(this.getRouteParameter('<%= entityId %>'), 10);
    this.id = this.getRouteParameter('<%= entityId %>');

    console.log("--> GET: <%= url('READ', true) %>", this.id);
    this.http.get("<%= url('READ', true) %>".replace(":<%= entityId %>", this.id))
    .subscribe((response: <%= typeName %>) => {
      console.log("<-- GET: <%= url('READ', true) %>", response);

      this.entity = response;
    }, (errorResponse: Response) => {
      console.log("<-- POST Error: <%= url('CREATE', true) %>", errorResponse);
    });
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  save() {
    console.log("<-- PATCH: <%= url('UPDATE', true) %>", this.entity);
    this.http.patch("<%= url('UPDATE', true) %>".replace(":<%= entityId %>", this.id), this.entity)
    .subscribe((response: <%= typeName %>) => {
      console.log("<-- PATCH: <%= url('UPDATE', true) %>", response);

      this.router.navigate(['..', 'list']);
    }, (errorResponse: Response) => {
      console.log("<-- PATCH Error: <%= url('UPDATE', true) %>", errorResponse);
    });
  }
}
