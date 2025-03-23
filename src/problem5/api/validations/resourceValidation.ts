import { Request, Response, NextFunction } from "express";
import { ResouceService } from "../services/resourceService";
import {
  IGetResourcesQuery,
  ICreateResourceBody,
  IUpdateResourceBody,
} from "../controllers/resourceInterface";

interface IErrorResp {
  field: string;
  error: string;
}

export class ResourceValidation {
  static async validateGetResources(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { limit, offset }: IGetResourcesQuery = req.query;
    const errors: IErrorResp[] = [];

    if (limit && isNaN(limit)) {
      errors.push({
        field: "limit",
        error: "must be number",
      });
    }

    if (limit && !isNaN(limit) && Number.isInteger(limit)) {
      errors.push({
        field: "limit",
        error: "must be integer",
      });
    }

    if (limit && limit < 0) {
      errors.push({
        field: "limit",
        error: "must be greater than equal to 0",
      });
    }

    if (offset && isNaN(offset)) {
      errors.push({
        field: "offset",
        error: "must be number",
      });
    }

    if (offset && !isNaN(offset) && Number.isInteger(offset)) {
      errors.push({
        field: "offset",
        error: "must be integer",
      });
    }

    if (offset && offset < 0) {
      errors.push({
        field: "offset",
        error: "must be greater than equal to 0",
      });
    }

    if (errors.length) {
      res.status(422).json({ errors });

      return;
    }

    next();
  }

  static async validateCreateResources(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { title, scores }: ICreateResourceBody = req.body;
    const errors: IErrorResp[] = [];

    if (!title) {
      errors.push({
        field: "title",
        error: "required",
      });
    }

    if (!scores || isNaN(scores)) {
      errors.push({
        field: "scores",
        error: "must be number",
      });
    }

    if (errors.length) {
      res.status(422).json({ errors });

      return;
    }

    next();
  }

  static async validateUpdateResources(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { title, scores }: ICreateResourceBody = req.body;
    const errors: IErrorResp[] = [];

    if (!title) {
      errors.push({
        field: "title",
        error: "required",
      });
    }

    if (!scores || isNaN(scores)) {
      errors.push({
        field: "scores",
        error: "must be number",
      });
    }

    if (errors.length) {
      res.status(422).json({ errors });

      return;
    }

    next();
  }
}
