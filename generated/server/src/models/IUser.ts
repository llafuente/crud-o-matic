
export interface IUser {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  userlogin: string;
  password: string;
  email: string;
  salt: string;
  roleId: string;
  voucherId: string;
  testId: string;
  state: string;
  stats: {
    testId: string;
    questionId: string;
    startAt: Date;
    endAt: Date;
    type: string;
  }[];

  authenticate(password: string);
}

export class UserType implements IUser {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  userlogin: string;
  password: string;
  email: string;
  salt: string;
  roleId: string;
  voucherId: string = null;
  testId: string = null;
  state: string = "active";
  stats: {
    testId: string;
    questionId: string;
    startAt: Date;
    endAt: Date;
    type: string;
  }[] = [];
  constructor() {}

  static fromJSON(obj: IUser | any): UserType {
    const r = new UserType();

    r.userlogin = obj.userlogin;

    r.password = obj.password;

    r.email = obj.email;

    r.salt = obj.salt;

    r.roleId = obj.roleId;

    r.voucherId = obj.voucherId;

    r.testId = obj.testId;

    r.state = obj.state;

    r.stats = obj.stats;

    return r;
  }

  authenticate(password: string) {}
}
