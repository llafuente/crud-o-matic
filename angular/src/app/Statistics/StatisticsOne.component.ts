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
  templateUrl: "./StatisticsOne.component.html",
})
export class StatisticsOneComponent extends BaseComponent {
  testId: string;

  entities: Pagination<TestType>;
  users: Pagination<UserType>;
  testAnswers: number[];
  validAnswers: number = 0;
  test: TestType = null;
  tResults: { ok: number; ko: number } = { ok: 0, ko: 0 };
  qResults: Array<{ ok: number; ko: number }> = [];
  flatternQuestions: any[] = [];

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
    this.users.list = this.users.list.filter((user) => {
      let stat = null;
      for (let i = 0; i < user.stats.length; ++i) {
        const s = user.stats[i];
        if (s.type == "test" && s.testId == this.test.id) {
          stat = s;
          stat.answers = stat.answers.map((x) => {
            return parseInt(x, 10);
          });
        }
      }

      if (!stat) {
        return false;
      }
      user.stats = null;

      (user as any).stat = stat; // this is the stat that matters
      (user as any).ok = 0; // this is the stat that matters
      (user as any).ko = 0; // this is the stat that matters
      return true;
    });

    let idx = 0;
    this.testAnswers = [];
    this.test.blocks.forEach((block) => {
      block.questions.forEach((question) => {
        this.flatternQuestions.push(question);

        question.answers[0].answerLabel;
        // NOTE -1, because in the editor human are confortable with 1-X range
        this.qResults[this.testAnswers.length] = { ok: 0, ko: 0 };
        this.testAnswers.push(question.correcAnswerIndex - 1);

        if (!question.invalidate) {
          ++this.validAnswers;
        }

        for (let user of this.users.list) {
          const stat = (user as any).stat;
          if (this.testAnswers[idx] == stat.answers[idx]) {
            ++this.tResults.ok;
            ++this.qResults[idx].ok;
            ++(user as any).ok;
          } else {
            ++this.tResults.ko;
            ++this.qResults[idx].ko;
            ++(user as any).ko;
          }
        }
        ++idx;
      });
    });

    for (let user of this.users.list) {
      (user as any).result = Math.floor((user as any).ok * 100 / this.validAnswers);
    }
  }

  toExcel() {
    const answersData: any[] = [["Pregunta", "Respuesta correcta"]];
    const questionsData: any[] = [["Pregunta", "Aciertos", "Errores"]];
    const usersData: any[] = [["Nombre y apellidos"]];

    const testData: any[] = [
      ["Examen", this.test.label],
      ["Tags", this.test.tags],
      ["Aciertos totales", this.tResults.ok],
      ["Errores totales", this.tResults.ko],
      [],
      ["Exámen"],
    ];
    let i = 1;
    for (const block of this.test.blocks) {
      for (const question of block.questions) {
        answersData.push([i, question.correcAnswerIndex]);
        usersData[0].push(`Respuesta ${i}`);
        ++i;
      }
    }
    usersData[0].push(`Aciertos`);
    usersData[0].push(`Errores`);
    usersData[0].push(`%`);

    i = 1;
    for (const block of this.test.blocks) {
      for (const question of block.questions) {
        testData.push(["Pregunta", i, question.questionLabel]);
        let j = 1;
        for (const answer of question.answers) {
          testData.push(["Respuesta", j, answer.answerLabel]);
          ++j;
        }
        ++i;
      }
    }

    i = 1;
    for (const q of this.qResults) {
      questionsData.push([i, q.ok, q.ko]);
      ++i;
    }

    for (const user of this.users.list) {
      usersData.push(
        [user.name + " " + user.surname]
          .concat(
            (user as any).stat.answers.map((x) => {
              return "number" == typeof x ? x + 1 : x;
            }),
          )
          .concat([
            (user as any).ok,
            (user as any).ko,
            this.percentage((user as any).ok, (user as any).ko),
          ]),
      );
    }

    const workbook = {
      SheetNames: ["Examen", "Respuestas", "Preguntas", "Usuarios"],
      Sheets: {
        Examen: XLSX.utils.aoa_to_sheet(testData),
        Respuestas: XLSX.utils.aoa_to_sheet(answersData),
        Preguntas: XLSX.utils.aoa_to_sheet(questionsData),
        Usuarios: XLSX.utils.aoa_to_sheet(usersData),
      },
    };
    /* Add the sheet name to the list */
    //workbook.SheetNames.push(ws_name);
    /* Load the worksheet object */
    //workbook.Sheets[ws_name] = ws;

    //var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    const wopts = { bookType: "xlml", bookSST: false, type: "binary" };
    const wbout = XLSX.write(workbook, wopts as any);

    // console.log("wbout", wbout);
    // this.downloadFile("export.xml", wbout);

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: "text/xml;charset=utf-8" });

    fileSaver.saveAs(blob, "export.xml", true);
  }

  downloadFile(filename: string, contents: string) {
    let data, link;

    link = document.createElement("a");
    // 'data:text/csv;charset=utf-8,' + contents;
    // link.setAttribute('href', data);
    //link.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURI(contents));
    link.setAttribute(
      "href",
      "data:application/ocstream;charset=utf-8," + encodeURI(contents),
    );
    link.setAttribute("download", filename);
    link.click();
  }
}