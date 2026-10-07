import { Router } from "express";
import { BicycleDetailController } from "./bicycleDetail.controller";

const router = Router();
const controller = new BicycleDetailController();

router.get("/", controller.getBicycleWithDetail);
router.get("/carbon", controller.getcarbonbicycles);
router.get("/steel", controller.getsteelbicycles);
router.get("/aluminium", controller.getaluminiumbicycles);
router.get("/titanium", controller.gettittaniumbicycles);

router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;