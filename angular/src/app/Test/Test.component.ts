// BaseComponent
import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ITest } from "../../generated/src/models/ITest";
import { LoggedUser } from "../LoggedUser.service";
import { ModalDirective } from "ngx-bootstrap";

@Component({
  selector: "test-component",
  templateUrl: "./Test.component.html",
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

  @ViewChild("timeExpiredModal") timeExpiredModal: ModalDirective;
  @ViewChild("finishExamModal") finishExamModal: ModalDirective;
  @ViewChild("doneModal") doneModal: ModalDirective;

  get maxQuestion(): number {
    if (!this.test) {
      return null;
    }

    return this.test.blocks[this.currentBlock].questions.length || null;
  }

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public user: LoggedUser,
  ) {
    super(injector, activatedRoute);
    this.testId = this.getRouteParameter("testId");
    this.loadTest(this.testId);

    this.startTest();
    this.startQuestion(0);
  }

  countDown() {
    if (this.remainingTime === null) {
      return "-";
    }

    if (this.remainingTime <= 0) {
      return "Examen terminado";
    }

    let ret;

    const s = this.remainingTime % 60;
    const m = Math.floor(this.remainingTime / 60);
    const h = Math.floor(this.remainingTime / 3600);

    ret = h < 10 ? `0${h}` : h;
    ret += ":";
    ret += m < 10 ? `0${m}` : m;
    ret += ":";
    ret += s < 10 ? `0${s}` : s;

    return ret;
  }

  loadTest(testId: string) {
    // load test
    this.http
      .get(`${this.domain}/tests/${testId}`)
      .subscribe((response: ITest) => {
        this.test = response;
        this.remainingTime = this.test.maxTime * 60;
        // this.remainingTime = 15;

        const interval = this.interval(() => {
          --this.remainingTime;
          if (this.remainingTime == 0) {
            this.finishExamModal.hide();
            this.timeExpiredModal.show();
            this.finish(false, true, true);
            clearInterval(interval);
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

  finish(modal: boolean, confirmed: boolean, forced) {
    if (confirmed) {
      if (modal) {
        this.finishExamModal.hide();
      }
      this.endQuestion(this.currentQuestion, () => {
        this.endTest(forced);
      });
    } else if (modal) {
      this.finishExamModal.show();
    }
  }

  startQuestion(questionId: number) {
    this.http
      .post(
        `${this.domain}/users/stats/question-start/${this
          .testId}/${questionId}`,
        {},
      )
      .subscribe((response: any) => {
        console.log("startQuestion", response);

        this.stats = response;
      });
  }

  endQuestion(questionId: number, cb: () => void = null) {
    this.http
      .post(
        `${this.domain}/users/stats/question-end/${this.testId}/${this.stats
          .id}/${this.answers[this.currentQuestion]}`,
        {},
      )
      .subscribe((response: any) => {
        console.log("endQuestion", response);
        cb && cb();
      });
  }

  startTest() {
    this.http
      .post(`${this.domain}/users/stats/test-start/${this.testId}`, {})
      .subscribe((response: any) => {
        console.log("startQuestion", response);

        this.testStats = response;
      });
  }

  endTest(forced: boolean) {
    this.http
      .post(
        `${this.domain}/users/stats/test-end/${this.testId}/${this.testStats
          .id}`,
        {
          answers: this.answers,
        },
      )
      .subscribe((response: any) => {
        console.log("startQuestion", response);
        this.user.refresh();
        if (!forced) {
          this.doneModal.show();
        }
      });
  }

  exit() {
    this.router.navigate(["/home"]);
  }
}
