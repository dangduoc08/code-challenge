import { Request, Response } from "express";
import { ResouceService } from "../services/resourceService";
import { IGetResourcesQuery } from "./resourceInterface";

export class ResouceController {
  static async getResources(req: Request, res: Response) {
    try {
      const { limit = 10, offset = 0 }: IGetResourcesQuery = req.query;

      const [resources, total] = await Promise.all([
        ResouceService.getResources({
          limit: +limit,
          offset: +offset,
        }),
        ResouceService.countResources(),
      ]);

      res.json({ data: resources, total });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resource = await ResouceService.getResource(+id);

      res.json({ data: resource });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async createResource(req: Request, res: Response) {
    try {
      const { title, scores } = req.body;

      const resource = await ResouceService.createResource({
        title,
        scores: +scores,
      });

      res.json({ data: resource });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, scores } = req.body;

      const resource = await ResouceService.updateResource({
        id: +id,
        title,
        scores: +scores,
      });

      res.json({ data: resource });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ResouceService.deleteResource(+id);
      res.json({ data: result });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
