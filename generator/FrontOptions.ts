export abstract class FrontOptions {
  hidden: boolean = false;
  required: boolean = false;

  constructor() {

  }

  setRequired(required: boolean): FrontCreate {
    this.required = required;

    return this;
  }

  setHidden(hidden: boolean): FrontCreate {
    this.hidden = hidden;

    return this;
  }
}

export class FrontCreate extends FrontOptions {

}

export class FrontUpdate extends FrontOptions {

}
