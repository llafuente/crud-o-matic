
export interface IUser {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  userlogin: string;
  name: string;
  surname: string;
  identifier: string;
  email: string;
  group: string;
  password: string;
  salt: string;
  forceResetPassword: boolean;
  roleId: string;
  voucherId: string;
  testId: string;
  testsDoneIds: string[];
  state: string;
  stats: {
    testId: string;
    questionId: string;
    startAt: Date;
    endAt: Date;
    type: string;
    answers: number[];
  }[];

  authenticate(password: string);
}

export class UserType implements IUser {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  userlogin: string;
  name: string;
  surname: string;
  identifier: string;
  email: string;
  group: string;
  password: string;
  salt: string;
  forceResetPassword: boolean;
  roleId: string;
  voucherId: string = null;
  testId: string = null;
  testsDoneIds: string[] = [];
  state: string = "active";
  stats: {
    testId: string;
    questionId: string;
    startAt: Date;
    endAt: Date;
    type: string;
    answers: number[];
  }[] = [];
  constructor() {}

  static fromJSON(obj: IUser | any): UserType {
    const r = new UserType();

    r.userlogin = obj.userlogin;

    r.name = obj.name;

    r.surname = obj.surname;

    r.identifier = obj.identifier;

    r.email = obj.email;

    r.group = obj.group;

    r.password = obj.password;

    r.salt = obj.salt;

    r.forceResetPassword = obj.forceResetPassword;

    r.roleId = obj.roleId;

    r.voucherId = obj.voucherId;

    r.testId = obj.testId;

    r.testsDoneIds = obj.testsDoneIds;

    r.state = obj.state;

    r.stats = obj.stats;

    return r;
  }

  authenticate(password: string) {}
}
