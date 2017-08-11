<%= srcModel %>: any;


// TODO fetch<%= singularUc =>() must be added to constructor

fetch<%= singularUc =>() {
  this.http.get("<%= srcUrl %>").subscribe((response) => {
    this.<%= srcModel %> = response;
  });
}
