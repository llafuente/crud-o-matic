import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Config {
  onChange: Subject<any> = new Subject<any>();

  constructor() {}

  set(key: string, value: string) {
    localStorage.setItem(`config-${key}`, value);
  }

  get(key: string) {
    return localStorage.getItem(`config-${key}`);
  }
}
