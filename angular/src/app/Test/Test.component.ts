import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoggedUser } from "../LoggedUser.service";
import { ITest } from "../../generated/src/models/ITest";
import { BaseComponent } from "../../generated/src/Base.component";

@Component({
  selector: "test-component",
  templateUrl: "./Test.component.html",
})
export class TestComponent extends BaseComponent {
  answerIndexes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
  testId: string = null;
  test: ITest = null;

  currentBlock = 0;
  currentQuestion = 0;
  answers: number[] = [null];
  stats: { id: number } = null;

  get maxQuestion(): number {
    if (!this.test) return null;

    return this.test.blocks[this.currentBlock].questions.length || null;
  }

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public http: HttpClient,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);
    this.testId = this.getRouteParameter("testId");
    this.loadTest(this.testId);

    this.startQuestion(0);
  }

  loadTest(testId: string) {
    // load test
    this.http.get("http://localhost:3004/tests/" + testId).subscribe((response: ITest) => {
      this.test = response;
    });
  }

  next() {
    this.endQuestion(this.currentQuestion);

    ++this.currentQuestion;
    if (this.answers[this.currentQuestion] === undefined) {
      this.answers[this.currentQuestion] = null;
    }

    this.startQuestion(this.currentQuestion);
  }
  prev() {
    this.endQuestion(this.currentQuestion);

    --this.currentQuestion;

    this.startQuestion(this.currentQuestion);
  }

  startQuestion(questionId: number) {
    this.http
      .post(`http://localhost:3004/users/stats/test/${this.testId}/${questionId}/start`, {})
      .subscribe((response: any) => {
        console.log("startQuestion", response);

        this.stats = response;
      });
  }

  endQuestion(questionId: number) {
    this.http
      .post(`http://localhost:3004/users/stats/test/${this.testId}/${this.stats.id}/end`, {})
      .subscribe((response: any) => {
        console.log("endQuestion", response);
      });
  }
}
