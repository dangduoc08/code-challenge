import {
  IGetResourcesInput,
  ICreateResourceInput,
  IUpdateResourceInput,
} from "./resourceInterface";
import { AppDataSource } from "../dataSource";
import { Resource } from "../entities/resourceEntity";

export class ResouceService {
  static resourceRepo = AppDataSource.getRepository(Resource);

  static async countResources(): Promise<number> {
    return this.resourceRepo.count();
  }

  static async getResources({
    limit,
    offset,
  }: IGetResourcesInput): Promise<Resource[]> {
    return this.resourceRepo.find({
      take: limit,
      skip: offset,
      order: {
        id: "ASC",
      },
    });
  }

  static async getResource(id: number): Promise<Resource | null> {
    return this.resourceRepo.findOneBy({
      id,
    });
  }

  static async createResource({
    title,
    scores,
  }: ICreateResourceInput): Promise<Resource> {
    const newResource = await this.resourceRepo.create({ title, scores });
    const result = await this.resourceRepo.save(newResource);

    return result;
  }

  static async updateResource({
    id,
    title,
    scores,
  }: IUpdateResourceInput): Promise<Resource | null> {
    const existResouce = await this.resourceRepo.findOneBy({
      id,
    });

    if (!existResouce) {
      return null;
    }

    this.resourceRepo.merge(existResouce, { title, scores });
    await this.resourceRepo.save(existResouce);

    return existResouce;
  }

  static async deleteResource(id: number) {
    return await this.resourceRepo.delete(id);
  }
}
