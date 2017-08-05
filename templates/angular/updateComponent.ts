import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../BaseComponent';
import { <%= typeName %> } from '../../models/<%= interfaceName %>';

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
  id: number;
  entity: <%= typeName %> = new <%= typeName %>();

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: Http,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    this.id = parseInt(this.getRouteParameter('<%= entityId %>'), 10);

    this.http.get("/<%= singular %>/" + this.id)
    .subscribe((response: Response) => {
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
    this.http.patch("/<%= singular %>/" + this.id, this.entity)
    .subscribe((response: Response) => {
      this.router.navigate(['..', 'list']);
    });
  }
}
