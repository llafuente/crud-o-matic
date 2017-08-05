import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../BaseComponent';
import { UserType } from '../../models/IUser';

/**
 */
@Component({
  selector: 'user-update-component',
  template: `
<div>
</div>
  `,
})
export class UpdateUserComponent extends BaseComponent {
  loading: false;
  id: number;
  entity: UserType = new UserType();

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: Http,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    this.id = parseInt(this.getRouteParameter('userId'), 10);

    this.http.get("/user/" + this.id)
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
    this.http.patch("/user/" + this.id, this.entity)
    .subscribe((response: Response) => {
      this.router.navigate(['..', 'list']);
    });
  }
}
