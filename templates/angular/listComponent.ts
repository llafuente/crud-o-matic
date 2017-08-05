import { Component, Input, OnInit, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../BaseComponent';
import { <%= typeName %> } from '../../models/<%= interfaceName %>';
import { Pagination } from '../../common';

/**
 */
@Component({
  selector: '<%= singular %>-create-component',
  template: `
<bb-section>
  <bb-section-header>List</bb-section-header>
  <bb-section-content>
    <bb-table>
      <thead>
        <tr>
          <% _.each(backend.schema, (PrimiteType, key) => { %>
            <th><%= key %></th>
          <% }) %>
        <tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of entities?.list">
          <% _.each(backend.schema, (PrimiteType, key) => { %>
            <td>{{entity.<%= key %>}}</td>
          <% }) %>
        <tr>
      </tbody>
    </bb-table>
  </bb-section-content>
</bb-section>
  `,
})
export class <%= frontend.listComponent %> extends BaseComponent {
  loading: boolean = false;
  entities: Pagination<<%= typeName %>>;

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,

    public http: Http,
  ) {
    super(injector, activatedRoute);

    this.http.get("/<%= singular %>")
    .subscribe((response: Response) => {
      const json: Pagination<<%= typeName %>> = response.json();
      this.entities = Pagination.fromJSON<<%= typeName %>>(<%= typeName %>, json);
    });
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  destroy(idx: number, row: <%= typeName %>) {
    if (this.loading) return;

    this.loading = true;
    this.http.delete("/<%= singular %>")
    .subscribe((response: Response) => {
      this.entities.list.splice(idx, 1);
      this.loading = false;
    });
  }
}
