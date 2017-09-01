import * as express from "express";
import { Request } from "./app";
import { Voucher } from "./models/Voucher";

export const customAppRouter = express
  .Router()
  .post("/users/redeem-voucher", (req: Request, res: express.Response, next: express.NextFunction) => {
    const label = req.body.voucherKey;

    Voucher.findOne({
      key: label,
    })
      .exec()
      .then(voucher => {
        if (!voucher) {
          return res.status(404).json({ message: "No se pudo encontrar el Voucher" });
        }

        if (voucher.maxUses == voucher.currentUses) {
          return res.status(400).json({ message: "Voucher ha llegado al número máximo de usos" });
        }

        const now = Date.now();
        if (voucher.startAt.getTime() > now) {
          return res.status(400).json({ message: "Voucher aún no puede ser usado" });
        }

        if (voucher.endAt.getTime() < now) {
          return res.status(400).json({ message: "Voucher ha caducado" });
        }

        ++voucher.maxUses;
        req.loggedUser.voucherId = voucher._id;
        voucher
          .save()
          .then(() => {
            return req.loggedUser.save();
          })
          .then(() => {
            res.status(204).json();
          })
          .catch(next);
      });
  })
  .post("/users/test/:testId/:questionId/start", (req: Request, res: express.Response, next: express.NextFunction) => {
    const testId = req.param("testId", null);
    const questionId = req.param("questionId", null);

    // TODO check testId, questionId

    const statsIdx = req.loggedUser.stats.length;
    req.loggedUser.stats.push({
      testId: testId,
      questionId: questionId,
      type: "question",
      startAt: new Date(),
      endAt: null,
    });

    req.loggedUser
      .save()
      .then(userSaved => {
        res.status(200).json({ id: statsIdx });
      })
      .catch(next);
  });
