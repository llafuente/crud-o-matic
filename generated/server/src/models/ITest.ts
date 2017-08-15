
export interface ITest {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  label: String;
  instructions: String;
  randomizeAnwers: Boolean;
  blocks: {
    name: String;
    questions: {
      questions: String;
      answers: String[];
      correcAnswerIndex: Number;
    }[];
  }[];
  maxTime: Number;
  usersSubscribed: Number;
  usersDone: Number;
}

export class TestType implements ITest {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  label: String;
  instructions: String;
  randomizeAnwers: Boolean;
  blocks: {
    name: String;
    questions: {
      questions: String;
      answers: String[];
      correcAnswerIndex: Number;
    }[];
  }[] = [];
  maxTime: Number;
  usersSubscribed: Number;
  usersDone: Number;
  constructor() {}

  static fromJSON(obj: ITest | any): TestType {
    const r = new TestType();

    r.label = obj.label;

    r.instructions = obj.instructions;

    r.randomizeAnwers = obj.randomizeAnwers;

    r.blocks = obj.blocks;

    r.maxTime = obj.maxTime;

    r.usersSubscribed = obj.usersSubscribed;

    r.usersDone = obj.usersDone;

    return r;
  }
}
