import mongoose = require("mongoose");

import { IUser } from './IUser';
export * from './IUser';

export interface IUserModel extends IUser, mongoose.Document { }

export const UserSchema = new mongoose.Schema({
  
    userlogin: {
          type: String,
          unique: true
        },
  
    password: {
          type: String,
          unique: false
        },
  
    email: {
          type: String,
          unique: false
        },
  
    salt: {
          type: String,
          unique: false
        },
  
    roles: [],
  
    permissions: [],
  
    state: {
          type: String,
          unique: false
        },
  
    data: {
          type: Object,
          unique: false
        },
  
}, {
  "collection": "users"
});

export const User = mongoose.model<IUserModel>("User", UserSchema);
