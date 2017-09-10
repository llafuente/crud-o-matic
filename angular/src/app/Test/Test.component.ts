import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Component, Input, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoggedUser } from "../LoggedUser.service";
import { ITest } from "../../generated/src/models/ITest";
import { BaseComponent } from "../../generated/src/Base.component";
import { Router } from "@angular/router";

@Component({
  selector: "test-component",
  templateUrl: "./Test.component.html"
})
export class TestComponent extends BaseComponent {
  answerIndexes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
  testId: string = null;
  test: ITest = null;
  remainingTime: number = null;

  currentBlock = 0;
  currentQuestion = 0;
  answers: number[] = [null];
  stats: { id: number } = null;
  testStats: { id: number } = null;

  @ViewChild("timeExpiredModal") timeExpiredModal;
  @ViewChild("finishExamModal") finishExamModal;

  get maxQuestion(): number {
    if (!this.test) return null;

    return this.test.blocks[this.currentBlock].questions.length || null;
  }

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public user: LoggedUser
  ) {
    super(injector, activatedRoute);
    this.testId = this.getRouteParameter("testId");
    this.loadTest(this.testId);

    this.startTest();
    this.startQuestion(0);
  }

  countDown() {
    if (this.remainingTime == 0) {
      return "Examen terminado";
    }

    const s = this.remainingTime % 60;
    const m = Math.floor(this.remainingTime / 60);
    const h = Math.floor(this.remainingTime / 3600);

    return `${h}:${m}:${s}`;
  }

  loadTest(testId: string) {
    // load test
    this.http.get(`${this.config.get("domain")}/tests/${testId}`).subscribe((response: ITest) => {
      this.test = response;
      //this.remainingTime = this.test.maxTime * 60;
      this.remainingTime = 15;

      this.interval(() => {
        --this.remainingTime;
        if (this.remainingTime == 0) {
          this.finishExamModal.hide();
          this.timeExpiredModal.show();
          this.finish(false, true, false);
        }
      }, 1000);
    });
  }

  next() {
    this.endQuestion(this.currentQuestion);

    ++this.currentQuestion;
    /*
    if (this.answers[this.currentQuestion] === undefined) {
      this.answers[this.currentQuestion] = null;
    }
    */

    this.startQuestion(this.currentQuestion);
  }

  prev() {
    this.endQuestion(this.currentQuestion);

    --this.currentQuestion;

    this.startQuestion(this.currentQuestion);
  }

  finish(modal: boolean, confirmed: boolean, exit: boolean = true) {
    if (confirmed) {
      if (modal) {
        this.finishExamModal.hide();
      }
      this.endQuestion(this.currentQuestion, () => {
        this.endTest(exit);
      });
    } else if (modal) {
      this.finishExamModal.show();
    }
  }

  startQuestion(questionId: number) {
    this.http
      .post(`${this.config.get("domain")}/users/stats/question-start/${this.testId}/${questionId}`, {})
      .subscribe((response: any) => {
        console.log("startQuestion", response);

        this.stats = response;
      });
  }

  endQuestion(questionId: number, cb: Function = null) {
    this.http
      .post(`${this.config.get("domain")}/users/stats/question-end/${this.testId}/${this.stats.id}`, {})
      .subscribe((response: any) => {
        console.log("endQuestion", response);
        cb && cb();
      });
  }

  startTest() {
    this.http
      .post(`${this.config.get("domain")}/users/stats/test-start/${this.testId}`, {})
      .subscribe((response: any) => {
        console.log("startQuestion", response);

        this.testStats = response;
      });
  }

  endTest(exit: boolean) {
    this.http
      .post(`${this.config.get("domain")}/users/stats/test-end/${this.testId}/${this.testStats.id}`, {
        answers: this.answers
      })
      .subscribe((response: any) => {
        console.log("startQuestion", response);
        this.user.refresh();
        this.handleSubscription(
          this.user.onChange.subscribe(() => {
            if (exit) {
              this.exit();
            }
          })
        );
      });
  }

  exit() {
    this.router.navigate(["/home"]);
  }
}
