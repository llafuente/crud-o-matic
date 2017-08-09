import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { UserType } from '../models/IUser';

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
  id: string;
  entity: UserType = new UserType();

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: Http,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    //this.id = parseInt(this.getRouteParameter('userId'), 10);
    this.id = this.getRouteParameter('userId');

    console.log("--> GET: http://localhost:3004/users/:userId", this.id);
    this.http.get("http://localhost:3004/users/:userId".replace(":userId", this.id))
    .subscribe((response: Response) => {
      console.log("<-- GET: http://localhost:3004/users/:userId", response);

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
    console.log("<-- PATCH: http://localhost:3004/users/:userId", this.entity);
    this.http.patch("http://localhost:3004/users/:userId".replace(":userId", this.id), this.entity)
    .subscribe((response: Response) => {
      console.log("<-- PATCH: http://localhost:3004/users/:userId", response);

      this.router.navigate(['..', 'list']);
    });
  }
}
