
export interface IUser {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  userlogin: String;
  password: String;
  email: String;
  salt: String;
  roleId: String;
  voucherId: String;
  state: String;
  stats: {
    testId: String;
    questionId: String;
    startAt: Date;
    endAt: Date;
    type: String;
  }[];

  authenticate(password: string);
}

export class UserType implements IUser {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  userlogin: String;
  password: String;
  email: String;
  salt: String;
  roleId: String;
  voucherId: String;
  state: String = "active";
  stats: {
    testId: String;
    questionId: String;
    startAt: Date;
    endAt: Date;
    type: String;
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

    r.state = obj.state;

    r.stats = obj.stats;

    return r;
  }

  authenticate(password: string) {}
}
