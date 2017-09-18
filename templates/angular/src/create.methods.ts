  save() {
    console.log("--> POST: <%- url('CREATE', true) %>", JSON.stringify(this.entity, null, 2));
    this.http.post(`${this.domain}<%- url('CREATE', true) %>`, this.entity)
    .subscribe((response: <%= typeName %>) => {
      console.log("<-- POST: <%- url('CREATE', true) %>", JSON.stringify(response, null, 2));

      this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });

    }, (errorResponse: Response) => {
      console.log("<-- POST Error: <%- url('CREATE', true) %>", errorResponse);
    });
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }

<%
  eachField((fieldName, field) => {
    if (field.type == "Array") {
%>

push<%= field.getPathName() %>(item: any, <%= field.getIndexes().join(", ") %>) {
  this.<%= field.getPath().join(".") %> = this.<%= field.getPath().join(".") %> || [];
  this.<%= field.getPath().join(".") %>.push(item);
}

<%
    }
  });
%>

