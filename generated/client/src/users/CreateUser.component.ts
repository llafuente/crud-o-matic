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
  selector: 'user-create-component',
  template: `
<div>
<pre>entity: {{entity | json}}</pre>
</div>
  `,
})
export class CreateUserComponent extends BaseComponent {
  loading: false;
  id: number;
  entity: UserType = new UserType();

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
  }

  save() {
    console.log("--> POST: http://localhost:3004/users", this.entity);
    this.http.post("http://localhost:3004/users", this.entity)
    .subscribe((response: UserType) => {
      console.log("<-- POST: http://localhost:3004/users", response);

      this.router.navigate(['..', 'list']);
    }, (errorResponse: Response) => {
      console.log("<-- POST Error: http://localhost:3004/users", errorResponse);
    });
  }
}
