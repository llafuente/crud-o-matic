import * as mongoose from 'mongoose';


export interface IRole {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  label:string;

  
};


export class RoleType implements IRole {
  _id: string|any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  label:string;
  constructor() {}

  static fromJSON(obj: IRole|any): RoleType {
    const r = new RoleType();

    r.label = obj.label;

    return r;
  }

  
};
