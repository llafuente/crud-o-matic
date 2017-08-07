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
type: String
},
  
    email: {
type: String
},
  
    salt: {
type: String
},
  
    roles: {
type: Array,
items: {
type: String
}
},
  
    state: {
type: String,
default: "active",
enum: ["active","banned"]
},
  
}, {
  "collection": "users"
});

export const User = mongoose.model<IUserModel>("User", UserSchema);
