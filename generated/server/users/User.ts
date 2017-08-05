import mongoose = require("mongoose");

import { IUser } from '../../models/IUser';
export * from '../../models/IUser';

export interface IUserModel extends IUser, mongoose.Document { }

export const UserSchema = new mongoose.Schema({
  
    userlogin: String,
  
    password: String,
  
    email: String,
  
    salt: String,
  
    roles: [],
  
    permissions: [],
  
    state: String,
  
    data: Object,
  
}, {
  "collection": "users"
});

export const User = mongoose.model<IUserModel>("User", UserSchema);
