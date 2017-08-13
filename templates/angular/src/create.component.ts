import { Component, Input, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../Base.component';
import { <%= typeName %> } from '../models/<%= interfaceName %>';

/**
 */
@Component({
  selector: '<%= singular %>-create-component',
  template: `
<div>
<form #f="ngForm" novalidate>
  <%- frontend.getCreateControlsHTML() %>
  <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
  <bb-button (click)="save()">Guardar</bb-button>
</form>
<pre>entity: {{entity | json}}</pre>
</div>
  `,
})
export class <%= frontend.createComponent %> extends BaseComponent {
  loading: false;
  id: number;
  entity: <%= typeName %> = new <%= typeName %>();

  <%- frontend.getCreateDeclarations() %>

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
    console.log("--> POST: <%= url('CREATE', true) %>", JSON.stringify(this.entity, null, 2));
    this.http.post("<%= url('CREATE', true) %>", this.entity)
    .subscribe((response: <%= typeName %>) => {
      console.log("<-- POST: <%= url('CREATE', true) %>", JSON.stringify(response, null, 2));

      this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });

    }, (errorResponse: Response) => {
      console.log("<-- POST Error: <%= url('CREATE', true) %>", errorResponse);
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
