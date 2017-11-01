import { RootComponent } from "./Root.component";
export * from "./Root.component";

import { AppComponent } from "./app.component";
export * from "./app.component";

import { LoginComponent } from "./Login/Login.component";
export * from "./Login/Login.component";

import { UserLoginComponent } from "./UserLogin/UserLogin.component";
export * from "./UserLogin/UserLogin.component";

import { TestComponent } from "./Test/Test.component";
export * from "./Test/Test.component";

import { UserHomeComponent } from "./UserHome/UserHome.component";
export * from "./UserHome/UserHome.component";

import { StatisticsComponent } from "./Statistics/Statistics.component";
export * from "./Statistics/Statistics.component";

import { StatisticsOneComponent } from "./Statistics/StatisticsOne.component";
export * from "./Statistics/StatisticsOne.component";

import { SolvedTestComponent } from "./Statistics/SolvedTest.component";
export * from "./Statistics/SolvedTest.component";

import { TestUserComponent } from "./Statistics/TestUser.component";
export * from "./Statistics/TestUser.component";

import { LoggedUser } from "./LoggedUser.service";
export * from "./LoggedUser.service";

export const components = [
  RootComponent,
  AppComponent,
  LoginComponent,
  TestComponent,
  UserHomeComponent,
  StatisticsComponent,
  StatisticsOneComponent,
  SolvedTestComponent,
  TestUserComponent,
  UserLoginComponent,
];

export const services = [LoggedUser];
