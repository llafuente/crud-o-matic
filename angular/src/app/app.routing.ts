import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import * as BB4UI from "../bb4ui";
import * as App from "./";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: App.LoginComponent,
  },
  {
    path: "test/:testId",
    component: App.TestComponent,
  },
  {
    path: "home",
    component: App.UserHomeComponent,
  },
  //  {
  //    path: "",
  //    redirectTo: "typography",
  //    pathMatch: "full",
  //  },
  {
    path: "typography",
    component: BB4UI.BBTypographyExampleComponent,
  },
  {
    path: "lists",
    component: BB4UI.BBListsExampleComponent,
  },
  {
    path: "buttons",
    component: BB4UI.BBButtonExampleComponent,
  },
  {
    path: "forms",
    component: BB4UI.BBFormsExampleComponent,
  },
  {
    path: "alerts",
    component: BB4UI.BBAlertsExampleComponent,
  },
  {
    path: "cards",
    component: BB4UI.BBCardExampleComponent,
  },
  {
    path: "tabs",
    component: BB4UI.BBTabsExampleComponent,
  },
  {
    path: "tables",
    component: BB4UI.BBTablesExampleComponent,
  },
  {
    path: "badges",
    component: BB4UI.BBBadgesExampleComponent,
  },
  {
    path: "modals",
    component: BB4UI.BBModalExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
