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

  // for lists
  push(model: any[]) {
    model.push({});
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }
