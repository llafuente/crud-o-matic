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
<form #f="ngForm" novalidate>
  <bb-input-container label="Userlogin">
  <input
    bb-child
    type="text"
    id="id-userlogin"
    name="userlogin"
    [(ngModel)]="entity.userlogin"
    #userloginModel="ngModel"
    />

    <bb-errors [model]="userloginModel"></bb-errors>

</bb-input-container>

<bb-input-container label="Password">
  <input
    bb-child
    type="password"
    id="id-password"
    name="password"
    [(ngModel)]="entity.password"
    #passwordModel="ngModel" />

    <bb-errors [model]="passwordModel"></bb-errors>

</bb-input-container>

<bb-input-container label="Email">
  <input
    bb-child
    type="email" email
    id="id-email"
    name="email"
    [(ngModel)]="entity.email"
    #emailModel="ngModel" />

    <bb-errors [model]="emailModel"></bb-errors>

</bb-input-container>

<!-- hidden -->

<bb-input-container label="Roles">
  <select
    bb-child
    id="id-roles"
    name="roles"
    [(ngModel)]="entity.roles"
    #rolesModel="ngModel">
    <option *ngFor="let row of " [ngValue]="">row.</option>
    </select>

    <bb-errors [model]="rolesModel"></bb-errors>

</bb-input-container>

<bb-input-container label="State">
  <select
    bb-child
    id="id-state"
    name="state"
    [(ngModel)]="entity.state"
    #stateModel="ngModel">
    <option *ngFor="let row of stateValues" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="stateModel"></bb-errors>

</bb-input-container>

  <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
  <bb-button (click)="save()">Guardar</bb-button>
</form>
<pre>entity: {{entity | json}}</pre>
</div>
  `,
})
export class UpdateUserComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: UserType = new UserType();

  stateValues: {id: string, label: string}[] = [{"id":"active","label":"Active"},{"id":"banned","label":"Banned"}]

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
    console.log("<-- PATCH: http://localhost:3004/users/:userId", JSON.stringify(this.entity, null, 2));
    this.http.patch("http://localhost:3004/users/:userId".replace(":userId", this.id), this.entity)
    .subscribe((response: UserType) => {
      console.log("<-- PATCH: http://localhost:3004/users/:userId", JSON.stringify(response, null, 2));

      this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    }, (errorResponse: Response) => {
      console.log("<-- PATCH Error: http://localhost:3004/users/:userId", errorResponse);
    });
  }

  // for lists
  push(model: any[]) {
    model.push({});
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
