import { Router, type IRouter } from "express";
import cartRouter from "./cart";
import healthRouter from "./health";
import menuRouter from "./menu";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(cartRouter);
router.use(paymentsRouter);

export default router;
