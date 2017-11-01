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
import * as XLSX from "xlsx";
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

import * as fileSaver from "file-saver";

@Component({
  selector: "statistics-component",
  template: `
    <h3>Usuario</h3>
    <p><strong>Nombre:</strong> {{user?.name}} {{user.surname}}</p>
    <p><strong>Email:</strong> {{user?.email}}</p>

    <h3>Resultado del exámen</h3>
    <p><strong>Preguntas acertadas:</strong> {{ok}}</p>
    <p><strong>Preguntas incorrectas:</strong> {{ko}}</p>
    <p><strong>Nota final:</strong> {{result}}%</p>

    <h3>Exámen</h3>
    <solved-test [test]="test" [answers]="answers" [showCorrectAnswer]="true"></solved-test>
`,
})
export class TestUserComponent extends BaseComponent {
  testId: string;
  userId: string;

  test: TestType;
  user: UserType;

  answers: number[];
  testCorrectAnswers: number[];
  validAnswers: number = 0;

  ok: number = 0;
  ko: number = 0;
  result: number = 0;

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
  ) {
    super(injector, activatedRoute);
    this.testId = this.getRouteParameter("testId");
    this.userId = this.getRouteParameter("userId");

    this.refresh();
  }

  refresh() {
    console.log(`--> GET: ${this.domain}/api/v1/users`);
    this.http.get(`${this.domain}/api/v1/users/${this.userId}`).subscribe(
      (response: Pagination<UserType>) => {
        console.log(
          `<-- GET: ${this.domain}/api/v1/users/${this.userId}`,
          response,
        );

        this.user = UserType.fromJSON(response);

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
    let stat = null;
    for (let i = 0; i < this.user.stats.length; ++i) {
      const s = this.user.stats[i];
      if (s.type == "test" && s.testId == this.test.id) {
        stat = s;
      }
    }

    this.answers = stat.answers.map((x) => {
      return parseInt(x, 10);
    });

    let idx = 0;
    this.testCorrectAnswers = [];
    this.test.blocks.forEach((block) => {
      block.questions.forEach((question) => {
        question.answers[0].answerLabel;
        // NOTE -1, because in the editor human are confortable with 1-X range
        this.testCorrectAnswers.push(question.correcAnswerIndex - 1);

        if (!question.invalidate) {
          ++this.validAnswers;
          if (this.testCorrectAnswers[idx] == this.answers[idx]) {
            ++this.ok;
          } else {
            ++this.ko;
          }
        }
        ++idx;
      });
    });

    this.result = Math.floor(this.ok * 100 / this.validAnswers);
  }
}
