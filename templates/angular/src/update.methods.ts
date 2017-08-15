  save() {
    console.log("<-- PATCH: <%= url('UPDATE', true) %>", JSON.stringify(this.entity, null, 2));
    this.http.patch("<%= url('UPDATE', true) %>".replace(":<%= entityId %>", this.id), this.entity)
    .subscribe((response: <%= typeName %>) => {
      console.log("<-- PATCH: <%= url('UPDATE', true) %>", JSON.stringify(response, null, 2));

      this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    }, (errorResponse: Response) => {
      console.log("<-- PATCH Error: <%= url('UPDATE', true) %>", errorResponse);
    });
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
<%
  eachField((fieldName, field) => {
    if (field.type == "Array") {
      console.log(field);
%>

push<%= field.getPathName() %>(item: any, <%= field.getIndexes().join(", ") %>) {
  this.<%= field.getPath().join(".") %> = this.<%= field.getPath().join(".") %> || [];
  this.<%= field.getPath().join(".") %>.push(item);
}

<%
    }
  });
%>
