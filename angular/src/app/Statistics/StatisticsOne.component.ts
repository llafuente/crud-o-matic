// BaseComponent
import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { Response } from "@angular/http";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap";
import * as qs from "qs";
import {
  ListQueryParams,
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
  templateUrl: "./StatisticsOne.component.html",
})
export class StatisticsOneComponent extends BaseComponent {
  testId: string;
  answerIndexes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];
  entities: Pagination<TestType>;
  users: Pagination<UserType>;
  usersInTest: UserType[];
  testAnswers: number[];
  test: TestType = null;
  tResults = { ok: 0, ko: 0 };
  qResults = [];

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);
    this.testId = this.getRouteParameter("testId");

    this.refresh();
  }

  refresh() {
    console.log(`--> GET: ${this.domain}/api/v1/users`);
    this.http
      .get(
        `${this.domain}/api/v1/users?` +
          qs.stringify(
            new ListQueryParams(
              0,
              0,
              null,
              {
                testsDoneIds: new WhereQuery(Operators.IN, this.testId),
              },
              null,
              null, //["name","stats"]
            ),
          ),
      )
      .subscribe(
        (response: Pagination<UserType>) => {
          console.log(`<-- GET: ${this.domain}/api/v1/users`, response);

          this.users = Pagination.fromJSON<UserType>(UserType, response);

          console.log(`--> GET: ${this.domain}/api/v1/tests/${this.testId}`);
          this.http.get(`${this.domain}/api/v1/tests/${this.testId}`).subscribe(
            (response: TestType) => {
              console.log(
                `<-- GET: ${this.domain}/api/v1/tests/${this.testId}`,
                response,
              );

              this.test = response;

              this.generateStats();
            },
            (errorResponse: Response) => {
              console.log(
                `<-- GET Error: ${this.domain}/api/v1/tests/${this.testId}`,
                errorResponse,
              );
              this.errorHandler(errorResponse);
            },
          );
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

  percentage(ok, errors) {
    return Math.floor(ok / (ok + errors) * 100);
  }

  generateStats() {
    this.testAnswers = [];
    this.test.blocks.forEach((block) => {
      block.questions.forEach((question) => {
        question.answers[0].answerLabel;
        // NOTE -1, because in the editor human are confortable with 1-X range
        this.qResults[this.testAnswers.length] = { ok: 0, ko: 0 };
        this.testAnswers.push(question.correcAnswerIndex - 1);
      });
    });
    this.usersInTest = [];

    this.users.list.forEach((user) => {
      if (user.testsDoneIds.indexOf(this.test.id) !== -1) {
        let stat = null;
        for (let i = 0; i < user.stats.length; ++i) {
          const s = user.stats[i];
          if (s.type == "test" && s.testId == this.test.id) {
            stat = s;
          }
        }

        if (stat) {
          this.usersInTest.push(user);
          user.stats = null;
          (user as any).stat = stat; // this is the stat that matters
          (user as any).sucesses = 0; // this is the stat that matters
          (user as any).failures = 0; // this is the stat that matters
          stat.answers.forEach((answerIdx, idx) => {
            if (this.testAnswers[idx] == answerIdx) {
              ++this.tResults.ok;
              ++this.qResults[idx].ok;
              ++(user as any).sucesses;
            } else {
              ++this.tResults.ko;
              ++this.qResults[idx].ko;
              ++(user as any).failures;
            }
          });

          (user as any).result = (user as any).sucesses * 100;
          (user as any).result /= this.testAnswers.length;
          (user as any).result = Math.floor((user as any).result);
        }
      }
    });
  }
}
