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
  selector: "update-users-component",
  template: `

<bb-section>
  <bb-section-header>UpdateUserComponent</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Userlogin"
  
  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-userlogin"
    name="userlogin"
    
    required="required"
    
    [(ngModel)]="entity.userlogin"
    #userlogin="ngModel"
    />

    <bb-errors [model]="userlogin"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Password"
  
  class="bordered top-label">
  <input
    bb-child
    type="password"
    id="id-password"
    name="password"
    
    required="required"
    
    [(ngModel)]="entity.password"
    #password="ngModel" />

    <bb-errors [model]="password"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Email"
  
  class="bordered top-label">
  <input
    bb-child
    type="email" email
    id="id-email"
    name="email"
    
    required="required"
    
    [(ngModel)]="entity.email"
    #email="ngModel" />

    <bb-errors [model]="email"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Rol"
  
  class="bordered top-label">
  <select
    bb-child
    id="id-roleId"
    name="roleId"
    
    [(ngModel)]="entity.roleId"
    #roleId="ngModel">
    <option *ngFor="let row of roles.list" [ngValue]="id">{{row.label}}</option>
    </select>

    <bb-errors [model]="roleId"></bb-errors>

</bb-input-container>

<bb-input-container
  label="State"
  
  class="bordered top-label">
  <select
    bb-child
    id="id-state"
    name="state"
    
    [(ngModel)]="entity.state"
    #state="ngModel">
    <option *ngFor="let row of stateValues" [ngValue]="row.id">{{row.label}}</option>
    </select>

    <bb-errors [model]="state"></bb-errors>

</bb-input-container>

      <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>
    
`,
})
export class UpdateUserComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: UserType = new UserType();

  roles: any;
stateValues: {id: string, label: string}[] = [{"id":"active","label":"Active"},{"id":"banned","label":"Banned"}];

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
    
    //this.id = parseInt(this.getRouteParameter("userId"), 10);
    this.id = this.getRouteParameter("userId");

    console.log("--> GET: http://localhost:3004/users/:userId", this.id);
    this.http.get("http://localhost:3004/users/:userId".replace(":userId", this.id))
    .subscribe((response: UserType) => {
      console.log("<-- GET: http://localhost:3004/users/:userId", response);

      this.entity = response;
    }, (errorResponse: Response) => {
      console.log("<-- POST Error: http://localhost:3004/users/:userId", errorResponse);
    });
    

this.http.get("http://localhost:3004/roles")
.subscribe((response: any) => {
  console.log("<-- GET: http://localhost:3004/roles", JSON.stringify(response, null, 2));

  this.roles = response;

}, (errorResponse: Response) => {
  console.log("<-- GET Error: http://localhost:3004/roles", errorResponse);
});

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

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }


}
