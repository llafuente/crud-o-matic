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
