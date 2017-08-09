import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { UserType } from '../models/IUser';

/**
 */
@Component({
  selector: 'user-update-component',
  template: `
<div>
<pre>entity: {{entity | json}}</pre>
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

    public http: HttpClient,
    public router: Router,
  ) {
    super(injector, activatedRoute);


    //this.id = parseInt(this.getRouteParameter('userId'), 10);
    this.id = this.getRouteParameter('userId');

    console.log("--> GET: http://localhost:3004/users/:userId", this.id);
    this.http.get("http://localhost:3004/users/:userId".replace(":userId", this.id))
    .subscribe((response: UserType) => {
      console.log("<-- GET: http://localhost:3004/users/:userId", response);

      this.entity = response;
    }, (errorResponse: Response) => {
      console.log("<-- POST Error: http://localhost:3004/users", errorResponse);
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
    .subscribe((response: UserType) => {
      console.log("<-- PATCH: http://localhost:3004/users/:userId", response);

      this.router.navigate(['..', 'list']);
    }, (errorResponse: Response) => {
      console.log("<-- PATCH Error: http://localhost:3004/users/:userId", errorResponse);
    });
  }
}
