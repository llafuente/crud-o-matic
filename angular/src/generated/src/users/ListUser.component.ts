import { Component, Input, OnInit, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { UserType } from '../models/IUser';
import { Pagination } from '../common';

/**
 */
@Component({
  selector: 'user-create-component',
  template: `
<bb-section>
  <bb-section-header>List</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>
          
            <th>userlogin</th>
          
            <th>password</th>
          
            <th>email</th>
          
            <th>roles</th>
          
            <th>state</th>
          
          <th>Actions</th>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list; let i = index">
          
            <td>{{entity.userlogin}}</td>
          
            <td>{{entity.password}}</td>
          
            <td>{{entity.email}}</td>
          
            <td>{{entity.roles}}</td>
          
            <td>{{entity.state}}</td>
          
          <td class="actions">
            <a [routerLink]="['..', 'update', entity._id]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
            <a (click)="destroy(i, entity)"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
          </td>
        <tr>
      </tbody>
    </bb-table>
  </bb-section-content>
</bb-section>
  `,
})
export class ListUserComponent extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<UserType>;

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: Http,
  ) {
    super(injector, activatedRoute);

    console.log("--> GET: http://localhost:3004/users");
    this.http.get("http://localhost:3004/users")
    .subscribe((response: Response) => {
      console.log("<-- GET: http://localhost:3004/users", response);

      const json: Pagination<UserType> = response.json();
      this.entities = Pagination.fromJSON<UserType>(UserType, json);
    });
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: UserType) {
    if (this.loading) return;

    this.loading = true;
    console.log("--> DELETE: http://localhost:3004/users/:userId", row);
    this.http.delete("http://localhost:3004/users/:userId".replace(":userId", "" + row._id))
    .subscribe((response: Response) => {
      console.log("<-- DELETE: http://localhost:3004/users/:userId", response);
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
