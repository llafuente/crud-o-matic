import { Component, Input, OnInit, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../BaseComponent';
import { UserType } from '../../models/IUser';
import { Pagination } from '../../common';

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
          
            <th>salt</th>
          
            <th>roles</th>
          
            <th>permissions</th>
          
            <th>state</th>
          
            <th>data</th>
          
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list">
          
            <td>{{entity.userlogin}}</td>
          
            <td>{{entity.password}}</td>
          
            <td>{{entity.email}}</td>
          
            <td>{{entity.salt}}</td>
          
            <td>{{entity.roles}}</td>
          
            <td>{{entity.permissions}}</td>
          
            <td>{{entity.state}}</td>
          
            <td>{{entity.data}}</td>
          
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

    this.http.get("/user")
    .subscribe((response: Response) => {
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
    this.http.delete("/user")
    .subscribe((response: Response) => {
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
