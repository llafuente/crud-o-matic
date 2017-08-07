import * as mongoose from 'mongoose';


export interface IUser {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  
    userlogin: String;
  
    password: String;
  
    email: String;
  
    salt: String;
  
    roles: any[];
  
    state: String;
  
};


export class UserType implements IUser {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  
  userlogin: String;
  
  password: String;
  
  email: String;
  
  salt: String;
  
  roles: any[];
  
  state: String;
  
  constructor() {}

  static fromJSON(obj: IUser|any): UserType {
    const r = new UserType();
  
    r.userlogin = obj.userlogin;
  
    r.password = obj.password;
  
    r.email = obj.email;
  
    r.salt = obj.salt;
  
    r.roles = obj.roles;
  
    r.state = obj.state;
  
    return r;
  }
};
