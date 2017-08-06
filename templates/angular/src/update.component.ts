import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { <%= typeName %> } from '../models/<%= interfaceName %>';

/**
 */
@Component({
  selector: '<%= singular %>-update-component',
  template: `
<div>
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

    public http: Http,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    //this.id = parseInt(this.getRouteParameter('<%= entityId %>'), 10);
    this.id = this.getRouteParameter('<%= entityId %>');

    console.log("--> GET: <%= url('READ', true) %>", this.id);
    this.http.get("<%= url('READ', true) %>".replace(":<%= entityId %>", this.id))
    .subscribe((response: Response) => {
      console.log("<-- GET: <%= url('READ', true) %>", response);

      this.entity = response.json();
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
    .subscribe((response: Response) => {
      console.log("<-- PATCH: <%= url('UPDATE', true) %>", response);

      this.router.navigate(['..', 'list']);
    });
  }
}
