import { Router, Request, Response } from "express";
import { ResourceValidation } from "../validations/resourceValidation";
import { ResouceController } from "../controllers/resourceController";

export const resourceRouter = Router();

resourceRouter.get(
  "/",
  ResourceValidation.validateGetResources,
  ResouceController.getResources
);

resourceRouter.get("/:id", ResouceController.getResource);

resourceRouter.post(
  "/",
  ResourceValidation.validateCreateResources,
  ResouceController.createResource
);

resourceRouter.put(
  "/:id",
  ResourceValidation.validateUpdateResources,
  ResouceController.updateResource
);

resourceRouter.delete("/:id", ResouceController.deleteResource);
