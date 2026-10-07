import { Router } from "express";
import { OrderItemController } from "./order-Item.controller";

const router = Router();

router.get("/", OrderItemController.getAll);
router.get("/order/:orderId", OrderItemController.getByOrderId);
router.get("/:id", OrderItemController.getById);
router.post("/", OrderItemController.create);
router.put("/:id", OrderItemController.update);
router.delete("/:id", OrderItemController.delete);

export default router;