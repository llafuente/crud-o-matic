import { Component, Input, OnInit, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { RoleType } from "../models/IRole";

/**
 */
@Component({
  selector: "create-roles-component",
  template: `

<bb-section>
  <bb-section-header>Crear Rol</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Etiqueta"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-label"
    name="label"

    [(ngModel)]="entity.label"
    #label="ngModel"
    />

    <bb-errors [model]="label"></bb-errors>

</bb-input-container>

      <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class CreateRoleComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: RoleType = new RoleType();

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  save() {
    console.log("--> POST: /roles", JSON.stringify(this.entity, null, 2));
    this.http.post(`${this.domain}/roles`, this.entity).subscribe(
      (response: RoleType) => {
        console.log("<-- POST: /roles", JSON.stringify(response, null, 2));

        this.router.navigate(["..", "list"], { relativeTo: this.activatedRoute });
      },
      (errorResponse: Response) => {
        console.log("<-- POST Error: /roles", errorResponse);
      },
    );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
}
