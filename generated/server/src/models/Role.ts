import mongoose = require("mongoose");
import { IRole } from './IRole';
export * from './IRole';
import { pbkdf2Sync, randomBytes} from 'crypto';


export interface IRoleModel extends IRole, mongoose.Document { }

export const RoleSchema = new mongoose.Schema({
  label:{
type: String
}
}, {
  "collection": "roles"
});




export const Role = mongoose.model<IRoleModel>("Role", RoleSchema);
