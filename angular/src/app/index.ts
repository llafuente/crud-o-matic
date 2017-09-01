import { AppComponent } from "./app.component";
export * from "./app.component";

import { LoginComponent } from "./Login/Login.component";
export * from "./Login/Login.component";

import { TestComponent } from "./Test/Test.component";
export * from "./Test/Test.component";

import { UserHomeComponent } from "./UserHome/UserHome.component";
export * from "./UserHome/UserHome.component";



import { LoggedUser } from "./LoggedUser.service";
export * from "./LoggedUser.service";

export const components = [AppComponent, LoginComponent, TestComponent, UserHomeComponent];

export const services = [LoggedUser];
