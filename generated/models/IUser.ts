export interface IUser {
  
    userlogin: String;
  
    password: String;
  
    email: String;
  
    salt: String;
  
    roles: any[];
  
    permissions: any[];
  
    state: String;
  
    data: Object;
  
};


export class UserType implements IUser {
  
  public userlogin: String;
  
  public password: String;
  
  public email: String;
  
  public salt: String;
  
  public roles: any[];
  
  public permissions: any[];
  
  public state: String;
  
  public data: Object;
  
  constructor() {}

  static fromJSON(obj: IUser|any): UserType {
    const r = new UserType();
  
    r.userlogin = obj.userlogin;
  
    r.password = obj.password;
  
    r.email = obj.email;
  
    r.salt = obj.salt;
  
    r.roles = obj.roles;
  
    r.permissions = obj.permissions;
  
    r.state = obj.state;
  
    r.data = obj.data;
  
    return r;
  }
};
