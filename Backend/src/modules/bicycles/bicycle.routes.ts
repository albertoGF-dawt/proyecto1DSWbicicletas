import { Router } from "express";
import { bicycleController } from "./bicycle.controller";
const router = Router();
router.get("/", bicycleController.getAll);
router.get("/:id", bicycleController.getById);
router.post("/", bicycleController.create);
router.put("/:id", bicycleController.update);
router.delete("/:id", bicycleController.delete);
export default router;
