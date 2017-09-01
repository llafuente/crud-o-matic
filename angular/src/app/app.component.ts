import { Component, OnInit } from "@angular/core";
import { LoggedUser } from "./LoggedUser.service";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(public user: LoggedUser) {}
  ngOnInit() {}
}
