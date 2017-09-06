import mongoose = require("mongoose");
import { IRole } from "./IRole";
export * from "./IRole";

export interface IRoleModel extends IRole, mongoose.Document {}

export const RoleSchema = new mongoose.Schema(
  {
    label: {
      type: String,
    },
  },
  {
    collection: "roles",
  },
);

export const Role = mongoose.model<IRoleModel>("Role", RoleSchema);
