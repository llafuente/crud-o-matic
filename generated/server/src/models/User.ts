import mongoose = require("mongoose");

import { IUser } from './IUser';
export * from './IUser';

export interface IUserModel extends IUser, mongoose.Document { }

export const UserSchema = new mongoose.Schema({
  
    userlogin: {
          type: String,
          unique: true,
          default: null
        },
  
    password: {
          type: String,
          unique: false,
          default: null
        },
  
    email: {
          type: String,
          unique: false,
          default: null
        },
  
    salt: {
          type: String,
          unique: false,
          default: null
        },
  
    roles: [],
  
    permissions: [],
  
    state: {
          type: String,
          unique: false,
          default: null
        },
  
    data: {
          type: Object,
          unique: false,
          default: null
        },
  
}, {
  "collection": "users"
});

export const User = mongoose.model<IUserModel>("User", UserSchema);
