import * as express from "express";
import { Request } from "./app";
import { Voucher } from "./models/Voucher";

export const customAppRouter = express
.Router()
.post("/users/redeem-voucher/:voucherId", (req: Request, res: express.Response, next: express.NextFunction) => {
  const voucherId = req.param("voucherId", null);

  Voucher.findById(voucherId)
  .exec()
  .then((voucher) => {
    if (!voucher) {
      return res.status(404).json({message: "No se pudo encontrar el Voucher"});
    }

    if (voucher.maxUses == voucher.currentUses) {
      return res.status(400).json({message: "Voucher ha llegado al número máximo de usos"});
    }
    const now = Date.now();
    if (voucher.startAt.getTime() > now) {
      return res.status(400).json({message: "Voucher aún no puede ser usado"});
    }

    if (voucher.endAt.getTime() < now) {
      return res.status(400).json({message: "Voucher ha caducado"});
    }

    ++voucher.maxUses;
    //req.loggedUser.voucher = voucher._id;
    voucher.save().then(() => {

    });
  });

});
