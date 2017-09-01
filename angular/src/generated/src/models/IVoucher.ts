import * as mongoose from "mongoose";

export interface IVoucher {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  label: String;
  startAt: Date;
  endAt: Date;
  canDownload: boolean;
  maxUses: number;
  currentUses: number;
  testId: string;
}

export class VoucherType implements IVoucher {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  label: String;
  startAt: Date;
  endAt: Date;
  canDownload: boolean;
  maxUses: number;
  currentUses: number;
  testId: string;
  constructor() {}

  static fromJSON(obj: IVoucher | any): VoucherType {
    const r = new VoucherType();

    r.label = obj.label;

    r.startAt = obj.startAt;

    r.endAt = obj.endAt;

    r.canDownload = obj.canDownload;

    r.maxUses = obj.maxUses;

    r.currentUses = obj.currentUses;

    r.testId = obj.testId;

    return r;
  }
}
