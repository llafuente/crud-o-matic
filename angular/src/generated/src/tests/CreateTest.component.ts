import { Component, Input, OnInit, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "../Base.component";
import { TestType } from "../models/ITest";

/**
 */
@Component({
  selector: "create-tests-component",
  template: `

<bb-section>
  <bb-section-header>Crear examen</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    <bb-input-container
  label="Nombre del examén"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-label"
    name="label"

    [(ngModel)]="entity.label"
    #label="ngModel"
    />

    <bb-errors [model]="label"></bb-errors>

</bb-input-container>

<bb-input-container
  label="Instrucciones"

  class="bordered top-label">
  <textarea
    bb-child
    type="text"
    id="id-instructions"
    name="instructions"
    [(ngModel)]="entity.instructions"

    #instructions="ngModel">
    </textarea>

    <bb-errors [model]="instructions"></bb-errors>

</bb-input-container>

<bb-check
  id="id-randomizeAnwers"
  name="randomizeAnwers"

  [(ngModel)]="entity.randomizeAnwers">Aleatorizar respuestas</bb-check>

<h3 class="d-flex">
  <span>Bloques de conocimiento ({{entity?.blocks?.length || 0}})</span>
  <bb-button class="ml-auto" (click)="pushEntityBlocks({})">
    <i class="fa fa-plus"></i> Añadir
  </bb-button>
</h3>

<div class="ml-1">
  <div class="d-flex mb-1 p-1"
    *ngFor="let item of entity?.blocks; let blocksId = index"
    style="background-color: rgba(0,0,0,0.025); border: 1px solid rgba(0,0,0,0.05)">
    <div class="align-self-start text-center" style="width: 2rem">
    {{blocksId + 1}}
    </div>
    <div class="pl-1" style="width: 100%; border-left: 4px solid rgba(0,0,0,0.2)">
      <div class="d-flex">
        <bb-button class="ml-auto" type="danger" (click)="splice(entity.blocks, blocksId)">
          <i class="fa fa-trash-o"></i>
        </bb-button>
      </div>
      <!-- child -->
      <bb-input-container
  label="Nombre del bloque"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-name_{{blocksId}}"
    name="name_{{blocksId}}"

    [(ngModel)]="entity.blocks[blocksId].name"
    #name="ngModel"
    />

    <bb-errors [model]="name"></bb-errors>

</bb-input-container>

<h3 class="d-flex">
  <span>Preguntas ({{entity?.blocks[blocksId]?.questions?.length || 0}})</span>
  <bb-button class="ml-auto" (click)="pushEntityBlocksQuestions({},blocksId)">
    <i class="fa fa-plus"></i> Añadir
  </bb-button>
</h3>

<div class="ml-1">
  <div class="d-flex mb-1 p-1"
    *ngFor="let item of entity?.blocks[blocksId]?.questions; let questionsId = index"
    style="background-color: rgba(0,0,0,0.025); border: 1px solid rgba(0,0,0,0.05)">
    <div class="align-self-start text-center" style="width: 2rem">
    {{questionsId + 1}}
    </div>
    <div class="pl-1" style="width: 100%; border-left: 4px solid rgba(0,0,0,0.2)">
      <div class="d-flex">
        <bb-button class="ml-auto" type="danger" (click)="splice(entity.blocks[blocksId].questions, questionsId)">
          <i class="fa fa-trash-o"></i>
        </bb-button>
      </div>
      <!-- child -->
      <bb-input-container
  label="Pregunta"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-questions_{{blocksId}}_{{questionsId}}"
    name="questions_{{blocksId}}_{{questionsId}}"

    [(ngModel)]="entity.blocks[blocksId].questions[questionsId].questions"
    #questions="ngModel"
    />

    <bb-errors [model]="questions"></bb-errors>

</bb-input-container>

<h3 class="d-flex">
  <span>Respuestas ({{entity?.blocks[blocksId]?.questions[questionsId]?.answers?.length || 0}})</span>
  <bb-button class="ml-auto" (click)="pushEntityBlocksQuestionsAnswers({},blocksId, questionsId)">
    <i class="fa fa-plus"></i> Añadir
  </bb-button>
</h3>

<div class="ml-1">
  <div class="d-flex mb-1 p-1"
    *ngFor="let item of entity?.blocks[blocksId]?.questions[questionsId]?.answers; let answersId = index"
    style="background-color: rgba(0,0,0,0.025); border: 1px solid rgba(0,0,0,0.05)">
    <div class="align-self-start text-center" style="width: 2rem">
    {{answersId + 1}}
    </div>
    <div class="pl-1" style="width: 100%; border-left: 4px solid rgba(0,0,0,0.2)">
      <div class="d-flex">
        <bb-button class="ml-auto" type="danger" (click)="splice(entity.blocks[blocksId].questions[questionsId].answers, answersId)">
          <i class="fa fa-trash-o"></i>
        </bb-button>
      </div>
      <!-- child -->
      <bb-input-container
  label="Respuesta"

  class="bordered top-label">
  <input
    bb-child
    type="text"
    id="id-answer_{{blocksId}}_{{questionsId}}_{{answersId}}"
    name="answer_{{blocksId}}_{{questionsId}}_{{answersId}}"

    [(ngModel)]="entity.blocks[blocksId].questions[questionsId].answers[answersId].answer"
    #answer="ngModel"
    />

    <bb-errors [model]="answer"></bb-errors>

</bb-input-container>

      <!-- end child -->
    </div>
  </div>
</div>

<bb-input-container
  label="Índice de la respuesta correcta"

  class="bordered top-label">
  <input
    bb-child
    type="number"
    step="1"
    id="id-correcAnswerIndex_{{blocksId}}_{{questionsId}}"
    name="correcAnswerIndex_{{blocksId}}_{{questionsId}}"

    [(ngModel)]="entity.blocks[blocksId].questions[questionsId].correcAnswerIndex"
    #correcAnswerIndex="ngModel"
    />

    <bb-errors [model]="correcAnswerIndex"></bb-errors>

</bb-input-container>

      <!-- end child -->
    </div>
  </div>
</div>

      <!-- end child -->
    </div>
  </div>
</div>

<bb-input-container
  label="Tiempo máximo (minutos)"

  class="bordered top-label">
  <input
    bb-child
    type="number"
    step="1"
    id="id-maxTime"
    name="maxTime"

    [(ngModel)]="entity.maxTime"
    #maxTime="ngModel"
    />

    <bb-errors [model]="maxTime"></bb-errors>

</bb-input-container>

<bb-static label="Usuarios inscritos" class="bordered top-label">
{{entity.usersSubscribed | date }}
</bb-static>

<bb-static label="Usuarios que realizaron el examen" class="bordered top-label">
{{entity.usersDone | date }}
</bb-static>

      <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>

`,
})
export class CreateTestComponent extends BaseComponent {
  loading: false;
  id: string;
  entity: TestType = new TestType();

  constructor(injector: Injector, activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {
    super(injector, activatedRoute);
  }
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    // this.loading
  }

  save() {
    console.log("--> POST: http://localhost:3004/tests", JSON.stringify(this.entity, null, 2));
    this.http.post("http://localhost:3004/tests", this.entity).subscribe(
      (response: TestType) => {
        console.log("<-- POST: http://localhost:3004/tests", JSON.stringify(response, null, 2));

        this.router.navigate(["..", "list"], { relativeTo: this.activatedRoute });
      },
      (errorResponse: Response) => {
        console.log("<-- POST Error: http://localhost:3004/tests", errorResponse);
      },
    );
  }

  splice(model: any[], index: number) {
    model.splice(index, 1);
  }

  pushEntityBlocks(item: any) {
    this.entity.blocks = this.entity.blocks || [];
    this.entity.blocks.push(item);
  }

  pushEntityBlocksQuestions(item: any, blocksId) {
    this.entity.blocks[blocksId].questions = this.entity.blocks[blocksId].questions || [];
    this.entity.blocks[blocksId].questions.push(item);
  }

  pushEntityBlocksQuestionsAnswers(item: any, blocksId, questionsId) {
    this.entity.blocks[blocksId].questions[questionsId].answers =
      this.entity.blocks[blocksId].questions[questionsId].answers || [];
    this.entity.blocks[blocksId].questions[questionsId].answers.push(item);
  }
}