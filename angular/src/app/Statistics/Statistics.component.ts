// BaseComponent
import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { Response } from "@angular/http";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import {
  Operators,
  Order,
  Pagination,
  WhereQuery,
} from "../../generated/src/common";
import { TestType } from "../../generated/src/models/ITest";
import { UserType } from "../../generated/src/models/IUser";
import { LoggedUser } from "../LoggedUser.service";

@Component({
  selector: "statistics-component",
  templateUrl: "./Statistics.component.html",
})
export class StatisticsComponent extends BaseComponent {
  answerIndexes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
  entities: Pagination<TestType>;
  users: Pagination<UserType>;
  usersInTest: UserType[];
  testAnswers: number[];
  test: TestType = null;

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);

    this.refresh();
  }

  refresh() {
    console.log(`--> GET: ${this.domain}/api/v1/tests`);
    this.http.get(`${this.domain}/api/v1/tests`).subscribe(
      (response: Pagination<TestType>) => {
        console.log(`<-- GET: ${this.domain}/api/v1/tests`, response);

        this.entities = Pagination.fromJSON<TestType>(TestType, response);
      },
      (errorResponse: Response) => {
        console.log(
          `<-- GET Error: ${this.domain}/api/v1/tests`,
          errorResponse,
        );
        this.errorHandler(errorResponse);
      },
    );

    console.log(`--> GET: ${this.domain}/api/v1/users`);
    this.http.get(`${this.domain}/api/v1/users`).subscribe(
      (response: Pagination<UserType>) => {
        console.log(`<-- GET: ${this.domain}/api/v1/users`, response);

        this.users = Pagination.fromJSON<UserType>(UserType, response);
      },
      (errorResponse: Response) => {
        console.log(
          `<-- GET Error: ${this.domain}/api/v1/users`,
          errorResponse,
        );
        this.errorHandler(errorResponse);
      },
    );
  }

  generateStats(test: TestType) {
    this.test = test;
    this.testAnswers = [];
    test.blocks.forEach((block) => {
      block.questions.forEach((question) => {
        question.answers[0].answerLabel;
        // NOTE -1, because in the editor human are confortable with 1-X range
        this.testAnswers.push(question.correcAnswerIndex - 1);
      });
    });
    this.usersInTest = [];

    this.users.list.forEach((user) => {
      if (user.testsDoneIds.indexOf(test.id) !== -1) {
        this.usersInTest.push(user);
        user.stats.forEach((stat) => {
          if (stat.type == "test" && stat.testId == test.id) {
            (user as any).stat = stat; // this is the stat that matters
            (user as any).result = 0; // this is the stat that matters
            stat.answers.forEach((answerIdx, idx) => {
              if (this.testAnswers[idx] == answerIdx) {
                ++(user as any).result;
              }
            });

            (user as any).result *= 100;
            (user as any).result /= this.testAnswers.length;
            (user as any).result = Math.floor((user as any).result);
          }
        });
      }
    });
  }
}
