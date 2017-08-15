import mongoose = require("mongoose");
import { IUser } from "./IUser";
export * from "./IUser";
import { pbkdf2Sync, randomBytes } from "crypto";

export interface IUserModel extends IUser, mongoose.Document {}

export const UserSchema = new mongoose.Schema(
  {
    userlogin: {
      type: String,
      unique: true,
      required: true,
      maxlength: 32,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
    },
    salt: {
      type: String,
    },
    roleId: {
      type: String,
      ref: "Role",
    },
    state: {
      type: String,
      default: "active",
      enum: ["active", "banned"],
    },
  },
  {
    collection: "users",
  },
);

function makeSalt() {
  return randomBytes(16).toString("base64");
}

function encryptPassword(password, salt) {
  if (!password || !salt) {
    return null;
  }

  const saltBuff = new Buffer(salt, "base64");
  return pbkdf2Sync(password, saltBuff, 10000, 64, "sha512").toString("base64");
}

UserSchema.pre("save", function savePasswordHash(next) {
  if (this.isModified("password")) {
    this.salt = makeSalt();
    console.log("savePasswordHash", this.password, this.salt);
    this.password = encryptPassword(this.password, this.salt);
  }

  next();
});

UserSchema.pre("update", function updatePasswordHash(next) {
  const pwd = this._update.$set.password;
  if (pwd) {
    const salt = makeSalt();
    console.log("updatePasswordHash", pwd, salt);
    this.update(
      {},
      {
        $set: {
          salt: salt,
          password: encryptPassword(pwd, salt),
        },
      },
    );
  }

  next();
});

/**
 * Authenticate - check if the passwords are the same
 */
UserSchema.methods.authenticate = function authenticate(plainText) {
  return encryptPassword(plainText, this.salt) === this.password;
};

UserSchema.methods.hasPermission = function hasPermission(perm) {
  if (this.permissions.indexOf(perm) === -1) {
    // look at roles
    let found = false;
    let i;

    for (i = 0; i < this.roles.length; ++i) {
      if (this.roles[i].permissions.indexOf(perm) !== -1) {
        found = true;
      }
    }

    return found;
  }
  return true;
};

export const User = mongoose.model<IUserModel>("User", UserSchema);
