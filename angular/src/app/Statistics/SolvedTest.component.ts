// BaseComponent
import { Injector } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../generated/src/Base.component";

import { Component, Input } from "@angular/core";
import { UserType } from "../../generated/src/models/IUser";


@Component({
  selector: "solved-test",
  template: `
<div class="question" *ngFor="let question of test?.blocks[0].questions; let currentQuestion = index" [style.opacity]="question.invalidate ? 0.7 : 1">
  <h4><span class="blue">{{currentQuestion + 1}}</span>. {{question.questionLabel}} <span class="badge badge-danger" *ngIf="question.invalidate">Pregunta invalidada</span></h4>
  <ul class="list-unstyled">
    <li *ngFor="let answer of question?.answers; let currentAnswer = index;">
      <h6>
        <i
          [class.fa-check-square-o]="answers[currentQuestion] == currentAnswer"
          [class.fa-square-o]="answers[currentQuestion] != currentAnswer"
          class="fa" aria-hidden="true"></i>
        <strong class="blue">{{answerIndexes[currentAnswer]}})</strong> {{answer.answerLabel}}

        <span class="badge badge-success" *ngIf="showCorrectAnswer && currentAnswer == question.correcAnswerIndex - 1">Resuesta Correcta</span>
      </h6>
    </li>
  </ul>
</div>
`,
})
export class SolvedTestComponent extends BaseComponent {
  @Input()
  test: UserType;

  @Input()
  answers: number [];

  @Input()
  showCorrectAnswer = false;

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

  constructor(
    public injector: Injector,
    public activatedRoute: ActivatedRoute,
  ) {
    super(injector, activatedRoute);
  }
  ngInit() {
    console.log("test -->", this.test);
    console.log("answers -->", this.answers);
  }
}
