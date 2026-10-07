import { Router } from "express";
import { OrderController } from "./orders.controller";

const router = Router();

router.get("/", OrderController.getAll);

router.get("/customers/:customerId", OrderController.getByCustomerId);

router.get("/:id", OrderController.getById);

router.post("/", OrderController.create);

router.put("/:id", OrderController.update);

router.delete("/:id", OrderController.delete);

export default router;