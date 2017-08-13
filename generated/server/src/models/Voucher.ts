import mongoose = require("mongoose");
import { IVoucher } from "./IVoucher";
export * from "./IVoucher";

export interface IVoucherModel extends IVoucher, mongoose.Document {}

export const VoucherSchema = new mongoose.Schema(
  {
    startAt: {
      type: Date,
    },

    endAt: {
      type: Date,
    },

    canDownload: {
      type: Boolean,
    },

    maxUses: {
      type: Number,
    },

    currentUses: {
      type: Number,
    },
  },
  {
    collection: "vouchers",
  },
);

export const Voucher = mongoose.model<IVoucherModel>("Voucher", VoucherSchema);
