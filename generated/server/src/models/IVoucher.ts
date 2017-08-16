
export interface IVoucher {
  _id: string | any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  startAt: Date;
  endAt: Date;
  canDownload: boolean;
  maxUses: number;
  currentUses: number;
  testId: String;
}

export class VoucherType implements IVoucher {
  _id: string | any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  startAt: Date;
  endAt: Date;
  canDownload: boolean;
  maxUses: number;
  currentUses: number;
  testId: String;
  constructor() {}

  static fromJSON(obj: IVoucher | any): VoucherType {
    const r = new VoucherType();

    r.startAt = obj.startAt;

    r.endAt = obj.endAt;

    r.canDownload = obj.canDownload;

    r.maxUses = obj.maxUses;

    r.currentUses = obj.currentUses;

    r.testId = obj.testId;

    return r;
  }
}
